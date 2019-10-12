import {
  Aggregate,
  AggregateInterface,
  Command,
  CommandInterface,
  CommandRejected,
  EventHandler,
} from '@rouby/eventing';
import { GameCreated, JoinedGame, GameDeleted, LeftGame } from '../events';

export class Game extends Aggregate<{
  name: string;
  password: string | null;
  participants: { id: string }[];
}> {
  initialState() {
    return {
      name: '',
      password: null,
      participants: [],
    };
  }

  @Command({ needsAuthorization: true })
  create({ events }: CommandInterface, name: string, password: null | string) {
    if (!name) {
      throw new CommandRejected('No name given.');
    }

    events.publish<GameCreated>('GameCreated', { name, password });
  }

  @Command({ needsAuthorization: true })
  delete({ events, user }: CommandInterface) {
    if (!this.owner || user.id !== this.owner.id) {
      throw new CommandRejected('Only the creator can delete.');
    }

    events.publish<GameDeleted>('GameDeleted', {});
  }

  @Command({ needsAuthorization: true })
  join({ events, user }: CommandInterface, password?: string) {
    if (this.currentState.password && this.currentState.password !== password) {
      throw new CommandRejected('Game requires a passwort.');
    }

    if (this.currentState.participants.find(usr => usr.id === user.id)) {
      throw new CommandRejected('Already joined this game.');
    }

    events.publish<JoinedGame>('JoinedGame', {});
  }

  @Command({ needsAuthorization: true })
  leave({ events, user }: CommandInterface) {
    if (!this.owner || user.id === this.owner.id) {
      throw new CommandRejected('The creator cannot leave the game.');
    }

    if (!this.currentState.participants.find(usr => usr.id === user.id)) {
      throw new CommandRejected('Only participants can leave the game.');
    }

    events.publish<LeftGame>('LeftGame', {});
  }

  @EventHandler
  onCreated(event: GameCreated) {
    this.setState(s => ({
      ...s,
      name: event.data.name,
      password: event.data.password,
      participants: [event.user],
    }));
  }

  @EventHandler
  onJoined(event: JoinedGame) {
    this.setState(s => ({
      ...s,
      participants: [...s.participants, event.user],
    }));
  }

  @EventHandler
  onLeft(event: LeftGame) {
    this.setState(s => ({
      ...s,
      participants: s.participants.filter(p => p.id !== event.user.id),
    }));
  }
}

export type GameInterface = AggregateInterface<Game>;
