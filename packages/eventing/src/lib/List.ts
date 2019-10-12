import 'reflect-metadata';
import sift from 'sift';
import { DomainEvent } from './DomainEvent';

const EventHandlerSymbol = Symbol();
const PropertyHandlerSymbol = Symbol();

type PropertyConfig = {
  isPersonalIdentifiableInformation?: boolean;
  needsAuthorization?: boolean;
};

type Query<T> = {
  where?: { [P in keyof T]?: T[P] };
  skip?: number;
  take?: number;
};

export const $push = Symbol('Push operation');
export const $pull = Symbol('Pull operation');

const operations = {
  [$push]: <T>(arr: T[], val: T | T[]) => [
    ...arr,
    ...(Array.isArray(val) ? val : [val]),
  ],
  [$pull]: <T extends { [key: string]: unknown }>(
    arr: T[],
    val: Partial<T> | Partial<T>[],
  ) => {
    const predicate = Array.isArray(val)
      ? (d: T) => !val.some(v => Object.keys(v).every(key => v[key] === d[key]))
      : (d: T) => !Object.keys(val).every(key => val[key] === d[key]);
    return arr.filter(predicate);
  },
};

type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Operations<T extends ListEntry> = {
  [P in keyof T]?:
    | T[P]
    | { [$push]: T[P] | ArrayElement<T[P]> }
    | { [$pull]: Partial<T[P]> | Partial<ArrayElement<T[P]>> };
};

export abstract class ListEntry {
  id!: string;
  owner!: { id: string; name: string };
}

export default abstract class List<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ListEntry & { [key: string]: any }
> {
  private static [EventHandlerSymbol]: {
    [clazz: string]: { [event: string]: string };
  } = {};
  private static [PropertyHandlerSymbol]: {
    [clazz: string]: { [prop: string]: PropertyConfig };
  } = {};

  static getProjections(clazz: string) {
    return List[EventHandlerSymbol][clazz];
  }

  private state: T[] = [];
  private subscriptions = new Map<
    Query<T>,
    | {
        onUpdate: (data: T | undefined) => void;
        lastData: T | undefined;
        type: 'single';
      }
    | {
        onUpdate: (data: T[], total: number) => void;
        lastData: T[];
        type: 'multi';
      }
  >();

  get needsAuthorization() {
    return false;
  }

  protected add(newItem: T) {
    this.state.push(newItem);
    this.checkSubscriptions();
  }

  protected update(query: Query<T>, updates: Operations<T>) {
    const idx = this.state.findIndex(sift((query.where as {}) || {}));
    if (idx >= 0) {
      const updatedItem = Object.entries(updates).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'object' && $push in value) {
            return {
              ...acc,
              [key]: operations[$push](
                this.state[idx][key],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (value as any)[$push],
              ),
            };
          }
          if (typeof value === 'object' && $pull in value) {
            return {
              ...acc,
              [key]: operations[$pull](
                this.state[idx][key],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (value as any)[$pull],
              ),
            };
          }
          return {
            ...acc,
            [key]: value,
          };
        },
        {},
      );
      this.state.splice(idx, 1, { ...this.state[idx], ...updatedItem });
    }
    this.checkSubscriptions();
  }

  protected remove(query: Query<T>) {
    const idx = this.state.findIndex(sift((query.where as {}) || {}));
    if (idx >= 0) {
      this.state.splice(idx, 1);
    }
    this.checkSubscriptions();
  }

  private checkSubscriptions() {
    Array.from(this.subscriptions.entries()).forEach(([query, cfg]) => {
      switch (cfg.type) {
        case 'multi': {
          const data = this.state
            .filter(sift((query.where as {}) || {}))
            .slice(
              query.skip,
              query.skip !== undefined && query.take !== undefined
                ? query.skip + query.take
                : undefined,
            );
          // TODO better check equality
          if (data !== cfg.lastData || data.length !== cfg.lastData.length) {
            cfg.onUpdate(data, this.state.length);
          }
          break;
        }
        case 'single': {
          const data = this.state.find(sift((query.where as {}) || {}));
          if (data !== cfg.lastData) {
            cfg.onUpdate(data);
          }
          break;
        }
      }
    });
  }

  async find(query: Query<T>) {
    return {
      data: this.state
        .filter(sift((query.where as {}) || {}))
        .slice(
          query.skip,
          query.skip !== undefined && query.take !== undefined
            ? query.skip + query.take
            : undefined,
        ),
      total: this.state.length,
    };
  }

  async findAndSubscribe(
    query: Query<T>,
    onUpdate: (data: T[], total: number) => void,
  ) {
    const data = this.state
      .filter(sift((query.where as {}) || {}))
      .slice(
        query.skip,
        query.skip !== undefined && query.take !== undefined
          ? query.skip + query.take
          : undefined,
      );
    this.subscriptions.set(query, { onUpdate, lastData: data, type: 'multi' });
    onUpdate(data, this.state.length);
  }

  async findOne(query: Query<T>) {
    return this.state.find(sift((query.where as {}) || {}));
  }

  async findOneAndSubscribe(
    query: Query<T>,
    onUpdate: (data: T | undefined) => void,
  ) {
    const data = this.state.find(sift((query.where as {}) || {}));
    this.subscriptions.set(query, { onUpdate, lastData: data, type: 'single' });
    onUpdate(data);
  }

  public async handle(event: DomainEvent) {
    const handler = List[EventHandlerSymbol][this.constructor.name][event.name];
    const fn = ((this as {}) as {
      [P in typeof handler]?: (evt: DomainEvent) => void;
    })[handler];
    if (fn) {
      await fn.call(this, event);
      return true;
    }
    return false;
  }

  public async replay(events: DomainEvent[]) {
    for (const event of events) {
      await this.handle(event);
    }
  }
}

export function Property(config: PropertyConfig = {}) {
  return function(target: {}, propertyKey: string) {
    let map = List[PropertyHandlerSymbol][target.constructor.name];
    if (!map) {
      map = List[PropertyHandlerSymbol][target.constructor.name] = {};
    }
    map[propertyKey] = config;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Projection(target: List<any>, propertyKey: string) {
  const [type] = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  let map = List[EventHandlerSymbol][target.constructor.name];
  if (!map) {
    map = List[EventHandlerSymbol][target.constructor.name] = {};
  }
  map[type.name] = propertyKey;
}

export type ListInterface<T> = {
  find: (query: Query<T>) => Promise<{ data: T[]; total: number }>;
  findAndSubscribe: (
    query: Query<T>,
    onUpdate: (list: T[], total: number) => void,
  ) => () => void;
  findOne: (query: Query<T>) => Promise<T | undefined>;
  findOneAndSubscribe: (
    query: Query<T>,
    onUpdate: (data: T | undefined) => void,
  ) => () => void;
};
