import sift from 'sift';
import DomainEvent from './DomainEvent';
import { StoredEvent } from './StoredEvent';

const EventHandlerSymbol = Symbol();
const PropertyHandlerSymbol = Symbol();

type PropertyConfig = {
  isPersonalIdentifiableInformation?: boolean;
  needsAuthorization?: boolean;
};

type Query<T> = {
  where: { [P in keyof T]?: T[P] };
};

export default abstract class List<T> {
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

  get needsAuthorization() {
    return false;
  }

  add(newItem: T) {
    this.state.push(newItem);
  }

  remove(query: Query<T>) {
    const idx = this.state.findIndex(sift(query.where as {}));
    if (idx >= 0) {
      this.state.splice(idx, 1);
    }
  }

  async find(query: Query<T>) {
    return this.state.filter(sift(query.where as {}));
  }

  async findAndSubscribe(query: Query<T>) {
    // TODO subscribe
    return this.state.filter(sift(query.where as {}));
  }

  async findOne(query: Query<T>) {
    return this.state.find(sift(query.where as {}));
  }

  async findOneSubscribe(query: Query<T>) {
    // TODO subscribe
    return this.state.find(sift(query.where as {}));
  }

  public handle(event: StoredEvent) {
    const handler = List[EventHandlerSymbol][this.constructor.name][event.name];
    const fn = ((this as {}) as {
      [P in typeof handler]?: (evt: DomainEvent) => void;
    })[handler];
    if (fn) {
      fn.call(this, event.data);
    }
  }

  public replay(events: StoredEvent[]) {
    for (const event of events) {
      this.handle(event);
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

export function Projection(target: List<{}>, propertyKey: string) {
  const [type] = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  let map = List[EventHandlerSymbol][target.constructor.name];
  if (!map) {
    map = List[EventHandlerSymbol][target.constructor.name] = {};
  }
  map[type.name] = propertyKey;
}

export type ListInterface<T> = {
  find: (query: Query<T>) => Promise<T[]>;
  findAndSubscribe: (
    query: Query<T>,
    onUpdate: (l: T[]) => void,
  ) => Promise<T[]>;
  findOne: (query: Query<T>) => Promise<T>;
  findOneAndSubscribe: (
    query: Query<T>,
    onUpdate: (l: T) => void,
  ) => Promise<T>;
};
