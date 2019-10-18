import {
  $push,
  $this,
  List,
  ListEntry,
  ListInterface,
  Projection,
  Property,
  $update,
} from '@eventing/core';
import {
  GameCreated,
  GameStarted,
  JoinedGame,
  LeftGame,
  RaceSelected,
  GameSettingsChanged,
} from '../events';
import { GalaxyType, GalaxySize } from '@space/types';

export class GameOverview extends ListEntry {
  @Property()
  turn!: number;

  @Property()
  recentNews!: {
    summary: string;
    text?: string;
    onTurn: number;
    timestamp: number;
  }[];

  @Property()
  participants!: {
    id: string;
    name: string;
    color: string;
    race?: {
      id: string;
      name: string;
    };
  }[];

  @Property()
  playerSlots!: number;

  @Property()
  galaxyType!: GalaxyType;

  @Property()
  galaxySize!: GalaxySize;

  @Property()
  wormholes!: boolean;

  @Property()
  fogOfWar!: boolean;
}

export class GameOverviews extends List<GameOverview> {
  @Projection
  async onCreate(event: GameCreated) {
    this.add({
      id: event.aggregate.id,
      owner: event.user,
      turn: 0,
      recentNews: [],
      participants: [],
      playerSlots: event.data.playerSlots,
      galaxyType: GalaxyType.Elliptical,
      galaxySize:
        event.data.playerSlots > 8
          ? GalaxySize.Large
          : event.data.playerSlots > 4
          ? GalaxySize.Medium
          : GalaxySize.Small,
      wormholes: true,
      fogOfWar: true,
    });
  }

  @Projection
  async onStart(event: GameStarted) {
    this.update(
      { where: { id: event.aggregate.id } },
      { turn: 1, recentNews: [] },
    );
  }

  @Projection
  async onJoin(event: JoinedGame) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        participants: {
          [$push]: {
            ...event.user,
            color: event.data.color,
          },
        },
        recentNews: {
          [$push]: {
            summary: `${event.user.name} joined the game.`,
            onTurn: {
              [$this]: 'turn',
            },
            timestamp: event.metadata.timestamp,
          },
        },
      },
    );
  }

  @Projection
  async onSelectRace(event: RaceSelected) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        participants: {
          [$update]: {
            where: { id: event.user.id },
            set: {
              race: {
                id: event.data.id,
                name: 'unknown',
              },
            },
          },
        },
      },
    );
  }

  @Projection
  async onLeave(event: LeftGame) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        recentNews: {
          [$push]: {
            summary: `${event.user.name} left the game.`,
            onTurn: {
              [$this]: 'turn',
            },
            timestamp: event.metadata.timestamp,
          },
        },
      },
    );
  }

  @Projection
  onSettingsChange(event: GameSettingsChanged) {
    this.update({ where: { id: event.aggregate.id } }, { ...event.data });
  }
}

export type GameOverviewsInterface = ListInterface<GameOverview>;
