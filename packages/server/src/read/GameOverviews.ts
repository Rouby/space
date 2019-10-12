import {
  List,
  ListEntry,
  ListInterface,
  Projection,
  Property,
  $push,
} from '@rouby/eventing';
import { JoinedGame, LeftGame, GameCreated } from '../events';

export class GameOverview extends ListEntry {
  @Property()
  recentNews!: { summary: string; text?: string; timestamp: number }[];
}

export class GameOverviews extends List<GameOverview> {
  @Projection
  async onCreate(event: GameCreated) {
    this.add({
      id: event.aggregate.id,
      owner: event.user,
      recentNews: [],
    });
  }

  @Projection
  async onJoin(event: JoinedGame) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        recentNews: {
          [$push]: {
            summary: `${event.user.name} joined the game.`,
            timestamp: event.metadata.timestamp,
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
            timestamp: event.metadata.timestamp,
          },
        },
      },
    );
  }
}

export type GameOverviewsInterface = ListInterface<GameOverview>;
