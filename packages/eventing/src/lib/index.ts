export {
  Command,
  CommandRejected,
  default as Aggregate,
  EventHandler,
} from './Aggregate';
export * from './DomainEvent';
export {
  default as List,
  ListEntry,
  Projection,
  Property,
  $push,
  $pull,
  $this,
} from './List';

// Explicit type exports to circumvent weird transpilation warnings
import {
  AggregateInterface,
  CommandInterface,
  AggregateConstructorParameters,
} from './Aggregate';
import { ListInterface } from './List';
export type AggregateConstructorParameters = AggregateConstructorParameters;
export type AggregateInterface<T> = AggregateInterface<T>;
export type CommandInterface = CommandInterface;
export type ListInterface<T> = ListInterface<T>;
