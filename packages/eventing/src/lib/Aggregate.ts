import 'reflect-metadata';
import * as uuid from 'uuid/v4';
import DomainEvent from './DomainEvent';
import { StoredEvent } from './StoredEvent';

const EventHandlerSymbol = Symbol();
const CommandHandlerSymbol = Symbol();
export const CommandProcessed = Symbol();

type CommandConfig = {
  needsAuthorization?: boolean;
};

export default abstract class Aggregate<T> {
  private static [EventHandlerSymbol]: {
    [clazz: string]: { [event: string]: string };
  } = {};
  private static [CommandHandlerSymbol]: {
    [clazz: string]: { [command: string]: CommandConfig };
  } = {};

  static getCommandConfig(clazz: string, command: string) {
    return Aggregate[CommandHandlerSymbol][clazz][command];
  }

  static events?: { publish: (evt: DomainEvent) => void };

  constructor(public readonly id = uuid(), private state: T) {
    if (!this.state) {
      this.state = this.initialState();
    }
  }

  private batchStateUpdate = false;
  private stateUpdates: (T | ((state: T) => T))[] = [];

  protected get currentState() {
    return this.state;
  }

  protected abstract initialState(): T;

  protected setState(nextState: T | ((state: T) => T)) {
    this.stateUpdates.push(nextState);
    if (!this.batchStateUpdate) {
      this.handleStateUpdate();
    }
  }

  private handleStateUpdate() {
    this.state = this.stateUpdates.reduce<T>(
      (acc, update) =>
        typeof update === 'function'
          ? (update as ((state: T) => T))(acc)
          : update,
      this.state,
    );
    this.stateUpdates = [];
  }

  public handle(event: StoredEvent) {
    const fn = ((this as {}) as {
      [P in typeof event.constructor.name]?: (evt: DomainEvent) => void;
    })[Aggregate[EventHandlerSymbol][this.constructor.name][event.name]];
    if (fn) {
      fn.call(this, event.data);
    }
  }

  public replay(events: StoredEvent[]) {
    this.batchStateUpdate = true;
    for (const event of events) {
      this.handle(event);
    }
    this.batchStateUpdate = false;
    this.handleStateUpdate();
  }
}

export function EventHandler(target: Aggregate<{}>, propertyKey: string) {
  const [type] = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  let map = Aggregate[EventHandlerSymbol][target.constructor.name];
  if (!map) {
    map = Aggregate[EventHandlerSymbol][target.constructor.name] = {};
  }
  map[type.name] = propertyKey;
}

export function Command(config: CommandConfig = {}) {
  return function(target: Aggregate<{}>, propertyKey: string) {
    let map = Aggregate[CommandHandlerSymbol][target.constructor.name];
    if (!map) {
      map = Aggregate[CommandHandlerSymbol][target.constructor.name] = {};
    }
    map[propertyKey] = config;
  };
}

export class CommandRejected extends Error {}

export type CommandInterface = {
  events: { publish: (event: DomainEvent) => void };
  user: { id: string };
};

type Condition<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;
type CommandsOf<Base> = Condition<
  Base,
  (
    i: CommandInterface,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any
  ) => void | Promise<void>
>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgumentsOf<T> = T extends (i: CommandInterface, ...args: infer U) => any
  ? U
  : never;
type ClientFunctions<T, R> = {
  [P in keyof T]: (...args: ArgumentsOf<T[P]>) => Promise<R>;
};
// type AggregateObject<T> = T extends Aggregate<infer U> ? U : never;
export type AggregateInterface<T> = Omit<
  ClientFunctions<CommandsOf<T>, { id: string }>,
  'handle'
>;
