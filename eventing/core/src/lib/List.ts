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
export const $update = Symbol('Update operation');

export const $this = Symbol('This reference operation');

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
  [$update]: <T>(arr: T[], val: UpdateOp<T>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match = sift(val.where as any);
    return arr.map((d, idx, arr) =>
      match(d, idx, arr) ? { ...d, ...val.set } : d,
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [$this]: <T extends { [key: string]: any }>(state: T, accessor: string) =>
    accessor.split('.').reduce((acc, key) => acc[key], state),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function executeOperations(object: Operations<any>, state: any): any {
  if (typeof object !== 'object') {
    return object;
  }

  return Object.entries(object).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && $push in value) {
      return {
        ...acc,
        [key]: operations[$push](
          state[key],
          executeOperations(value[$push], state),
        ),
      };
    }
    if (typeof value === 'object' && $pull in value) {
      return {
        ...acc,
        [key]: operations[$pull](
          state[key],
          executeOperations(value[$pull], state),
        ),
      };
    }
    if (typeof value === 'object' && $update in value) {
      return {
        ...acc,
        [key]: operations[$update](
          state[key],
          executeOperations(value[$update], state),
        ),
      };
    }
    if (typeof value === 'object' && $this in value) {
      return {
        ...acc,
        [key]: operations[$this](state, executeOperations(value[$this], state)),
      };
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

type ArrayElement<T> = T extends (infer U)[] ? U : never;

type UpdateOp<T> = {
  where: {
    [P in keyof ArrayElement<T>]?: ArrayElement<T>[P];
  };
  set: Partial<Operations<ArrayElement<T>>>;
};
type Operations<T> = {
  [P in keyof T]:
    | (T[P])
    | { [$this]: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | (T[P] extends any[]
        ? {
            [$push]:
              | Operations<ArrayElement<T[P]>>
              | (Operations<ArrayElement<T[P]>>)[];
          }
        : never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | (T[P] extends any[]
        ? {
            [$pull]:
              | Partial<Operations<ArrayElement<T[P]>>>
              | (Partial<Operations<ArrayElement<T[P]>>>)[];
          }
        : never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | (T[P] extends any[]
        ? {
            [$update]: UpdateOp<T[P]>;
          }
        : never);
};

export abstract class ListEntry {
  id!: string;
  owner!: { id: string };
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

  private context = { aggregate: { id: '' }, user: { id: '', name: '' } };
  private state: T[] = [];
  private visibility = new Set<string>();
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

  get hasVisibility() {
    return false;
  }

  protected add(newItem: Omit<T, 'id' | 'owner'>) {
    this.state.push({
      ...newItem,
      id: this.context.aggregate.id,
      owner: { id: this.context.user.id },
    } as T);
    this.checkSubscriptions();
  }

  protected update(query: Query<T>, updates: Partial<Operations<T>>) {
    const idx = this.state.findIndex(sift((query.where as {}) || {}));
    if (idx >= 0) {
      this.state.splice(idx, 1, {
        ...this.state[idx],
        ...executeOperations(updates, this.state[idx]),
      });
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

  protected grantVisibility(...ids: string[]) {
    ids.forEach(id => this.visibility.add(id));
  }

  protected denyVisibility(...ids: string[]) {
    ids.forEach(id => this.visibility.delete(id));
  }

  private checkSubscriptions() {
    Array.from(this.subscriptions.entries()).forEach(async ([query, cfg]) => {
      switch (cfg.type) {
        case 'multi': {
          const data = await this.filter(query);
          // TODO better check equality
          if (data !== cfg.lastData || data.length !== cfg.lastData.length) {
            cfg.onUpdate(data, this.state.length);
          }
          break;
        }
        case 'single': {
          const data = await this.filterOne(query);
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
      data: await this.filter(query),
      total: this.state.length,
    };
  }

  async findAndSubscribe(
    query: Query<T>,
    onUpdate: (data: T[], total: number) => void,
  ) {
    const data = await this.filter(query);
    this.subscriptions.set(query, { onUpdate, lastData: data, type: 'multi' });
    onUpdate(data, this.state.length);
  }

  async findOne(query: Query<T>) {
    return this.filterOne(query);
  }

  async findOneAndSubscribe(
    query: Query<T>,
    onUpdate: (data: T | undefined) => void,
  ) {
    const data = await this.filterOne(query);
    this.subscriptions.set(query, { onUpdate, lastData: data, type: 'single' });
    onUpdate(data);
  }

  private async filter(query: Query<T>) {
    const list = this.hasVisibility
      ? this.state.filter(d => this.visibility.has(d.id))
      : this.state;
    return list
      .filter(sift((query.where as {}) || {}))
      .slice(
        query.skip,
        query.skip !== undefined && query.take !== undefined
          ? query.skip + query.take
          : undefined,
      );
  }

  private async filterOne(query: Query<T>) {
    const list = this.hasVisibility
      ? this.state.filter(d => this.visibility.has(d.id))
      : this.state;
    return list.find(sift((query.where as {}) || {}));
  }

  public async handle(event: DomainEvent) {
    const handler = List[EventHandlerSymbol][this.constructor.name][event.name];
    const fn = ((this as {}) as {
      [P in typeof handler]?: (evt: DomainEvent) => void;
    })[handler];
    if (fn) {
      this.context.aggregate = event.aggregate;
      this.context.user = event.user;
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

type ListElement<T> = T extends List<infer U> ? U : never;
export type ListInterface<T> = {
  find: (
    query: Query<ListElement<T>>,
  ) => Promise<{ data: ListElement<T>[]; total: number }>;
  findAndSubscribe: (
    query: Query<ListElement<T>>,
    onUpdate: (list: ListElement<T>[], total: number) => void,
  ) => () => void;
  findOne: (
    query: Query<ListElement<T>>,
  ) => Promise<ListElement<T> | undefined>;
  findOneAndSubscribe: (
    query: Query<ListElement<T>>,
    onUpdate: (data: ListElement<T> | undefined) => void,
  ) => () => void;
};
