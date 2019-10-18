import {
  Aggregate,
  Command,
  CommandInterface,
  CommandRejected,
  EventHandler,
} from '@eventing/core';
import { GalaxySize, GalaxyType } from '@space/types';
import {
  GameCreated,
  GameDeleted,
  GameSettingsChanged,
  GameStarted,
  JoinedGame,
  LeftGame,
  RaceSelected,
} from '../events';

export class Game extends Aggregate<{
  name: string;
  password: string | null;
  participants: { id: string }[];
  playerSlots: number;
  started: boolean;
  galaxyType: GalaxyType;
  galaxySize: GalaxySize;
  wormholes: boolean;
  fogOfWar: boolean;
}> {
  initialState() {
    return {
      name: '',
      password: null,
      participants: [],
      playerSlots: 0,
      started: false,
      galaxyType: GalaxyType.Elliptical,
      galaxySize: GalaxySize.Small,
      wormholes: true,
      fogOfWar: true,
    };
  }

  @Command()
  create(
    { events }: CommandInterface,
    name: string,
    password: null | string,
    playerSlots: number,
  ) {
    if (!name) {
      throw new CommandRejected('No name given.');
    }

    events.publish<GameCreated>('GameCreated', {
      name,
      password,
      playerSlots,
    });
    events.publish<JoinedGame>('JoinedGame', {
      color: `hsl(${Math.round(Math.random() * 12) * 30}, 100%, 50%)`,
    });
  }

  @Command({ needsAuthorization: true })
  delete({ events, user }: CommandInterface) {
    if (user && user.is(this.owner)) {
      throw new CommandRejected('Only the creator can delete.');
    }

    events.publish<GameDeleted>('GameDeleted', {});
  }

  @Command()
  join({ events, user }: CommandInterface, password?: string) {
    if (this.currentState.participants.find(usr => user.is(usr))) {
      throw new CommandRejected('Already joined this game.');
    }

    if (this.currentState.password && this.currentState.password !== password) {
      throw new CommandRejected('Game requires a passwort.');
    }

    if (
      this.currentState.playerSlots <= this.currentState.participants.length
    ) {
      throw new CommandRejected('All slots are already filled.');
    }

    events.publish<JoinedGame>('JoinedGame', {
      color: `hsl(${Math.round(Math.random() * 12) * 30}, 100%, 50%)`,
    });

    if (user) {
      user.authorize<Game>('selectRace');
    }
  }

  @Command()
  leave({ events, user }: CommandInterface) {
    if (user.is(this.owner)) {
      throw new CommandRejected('The creator cannot leave the game.');
    }

    if (!this.currentState.participants.find(usr => user.is(usr))) {
      throw new CommandRejected('Only participants can leave the game.');
    }

    events.publish<LeftGame>('LeftGame', {});
  }

  @Command({ needsAuthorization: true })
  selectRace({ events }: CommandInterface, id: string) {
    if (this.currentState.started) {
      throw new CommandRejected('You cannot change your race mid-game.');
    }

    events.publish<RaceSelected>('RaceSelected', {
      id,
    });
  }

  @Command({ needsAuthorization: true })
  selectGalaxyType({ events }: CommandInterface, galaxyType: GalaxyType) {
    if (this.currentState.started) {
      throw new CommandRejected('You cannot change the galaxy type mid-game.');
    }

    events.publish<GameSettingsChanged>('GameSettingsChanged', {
      galaxyType,
    });
  }

  @Command({ needsAuthorization: true })
  selectGalaxySize({ events }: CommandInterface, galaxySize: GalaxySize) {
    if (this.currentState.started) {
      throw new CommandRejected('You cannot change the galaxy size mid-game.');
    }

    events.publish<GameSettingsChanged>('GameSettingsChanged', {
      galaxySize,
    });
  }

  @Command({ needsAuthorization: true })
  toggleWormholes({ events }: CommandInterface, enabled: boolean) {
    if (this.currentState.started) {
      throw new CommandRejected('You cannot change galaxy features mid-game.');
    }

    events.publish<GameSettingsChanged>('GameSettingsChanged', {
      wormholes: enabled,
    });
  }

  @Command({ needsAuthorization: true })
  toggleFogOfWar({ events }: CommandInterface, enabled: boolean) {
    if (this.currentState.started) {
      throw new CommandRejected('You cannot change galaxy features mid-game.');
    }

    events.publish<GameSettingsChanged>('GameSettingsChanged', {
      fogOfWar: enabled,
    });
  }

  @Command({ needsAuthorization: true })
  start({ events }: CommandInterface) {
    if (this.currentState.started) {
      throw new CommandRejected(
        'You cannot start a game that has already begun.',
      );
    }

    events.publish<GameStarted>('GameStarted', {
      galaxyType: this.currentState.galaxyType,
      galaxySize: this.currentState.galaxySize,
      wormholes: this.currentState.wormholes,
      fogOfWar: this.currentState.fogOfWar,
      participants: this.currentState.participants,
    });
  }

  @EventHandler
  onCreated(event: GameCreated) {
    this.setState(s => ({
      ...s,
      name: event.data.name,
      password: event.data.password,
      participants: [],
      playerSlots: event.data.playerSlots,
      galaxyType: GalaxyType.Elliptical,
      galaxySize:
        event.data.playerSlots > 8
          ? GalaxySize.Large
          : event.data.playerSlots > 4
          ? GalaxySize.Medium
          : GalaxySize.Small,
    }));
  }

  @EventHandler
  onJoined(event: JoinedGame) {
    this.setState(s => ({
      ...s,
      participants: [...s.participants, { id: event.user.id }],
    }));
  }

  @EventHandler
  onLeft(event: LeftGame) {
    this.setState(s => ({
      ...s,
      participants: s.participants.filter(p => p.id !== event.user.id),
    }));
  }

  @EventHandler
  onStarted(_event: GameStarted) {
    this.setState(s => ({
      ...s,
      started: true,
    }));
  }

  @EventHandler
  onSettingsChanged(event: GameSettingsChanged) {
    this.setState(s => ({
      ...s,
      ...event.data,
    }));
  }
}
