import {
  Aggregate,
  AggregateInterface,
  Command,
  CommandInterface,
  CommandRejected,
  EventHandler,
} from '@rouby/eventing';
import { GameCreated } from '../events';

export class Game extends Aggregate<{
  name: string;
  password: string | null;
}> {
  initialState() {
    return {
      name: '',
      password: null,
    };
  }

  @Command({ needsAuthorization: true })
  create({ events }: CommandInterface, name: string, password: null | string) {
    if (!name) {
      throw new CommandRejected('No name given.');
    }

    events.publish<GameCreated>('GameCreated', { name, password });
  }

  @EventHandler
  onCreated(event: GameCreated) {
    this.setState(s => ({
      ...s,
      name: event.data.name,
      password: event.data.password,
    }));
  }
}

export type GameInterface = AggregateInterface<Game>;
