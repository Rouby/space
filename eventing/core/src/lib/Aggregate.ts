import 'reflect-metadata';
import * as uuid from 'uuid/v4';
import { DomainEvent } from './DomainEvent';

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

  constructor(
    public readonly id = uuid(),
    private state: T,
    public readonly owner: { id: string; name: string } | null = null,
  ) {
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

  public async handle(event: DomainEvent) {
    const fn = ((this as {}) as {
      [P in typeof event.constructor.name]?: (evt: DomainEvent) => void;
    })[Aggregate[EventHandlerSymbol][this.constructor.name][event.name]];
    if (fn) {
      await fn.call(this, event);
      return true;
    }
    return false;
  }

  public async replay(events: DomainEvent[]) {
    this.batchStateUpdate = true;
    for (const event of events) {
      await this.handle(event);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class DummyAggregate extends Aggregate<any> {
  protected initialState() {
    return {};
  }
}

export type AggregateConstructorParameters = ConstructorParameters<
  typeof DummyAggregate
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventName<T> = T extends DomainEvent<infer U, any> ? U : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventData<T> = T extends DomainEvent<any, infer U> ? U : never;

export type CommandInterface = {
  events: {
    publish: <T extends DomainEvent>(
      eventName: EventName<T>,
      event: EventData<T>,
    ) => void;
  };
  user: {
    id: string;
    authorize: <T>(...commands: (keyof AggregateInterface<T>)[]) => void;
  } | null;
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
export type AggregateInterface<T> = Omit<
  ClientFunctions<CommandsOf<T>, { id: string }>,
  'handle'
>;
