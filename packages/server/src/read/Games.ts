import {
  List,
  ListEntry,
  ListInterface,
  Projection,
  Property,
  $push,
  $pull,
} from '@rouby/eventing';
import { GameCreated, JoinedGame, GameDeleted, LeftGame } from '../events';

export class Game extends ListEntry {
  @Property()
  name!: string;

  @Property({
    needsAuthorization: true,
  })
  password!: string | null;

  @Property()
  participants!: { id: string; name: string }[];
}

export class Games extends List<Game> {
  @Projection
  onCreate(event: GameCreated) {
    this.add({
      id: event.aggregate.id,
      owner: event.user,
      name: event.data.name,
      password: event.data.password,
      participants: [event.user],
    });
  }

  @Projection
  onDelete(event: GameDeleted) {
    this.remove({
      where: { id: event.aggregate.id },
    });
  }

  @Projection
  async onJoin(event: JoinedGame) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        participants: { [$push]: event.user },
      },
    );
  }

  @Projection
  async onLeave(event: LeftGame) {
    this.update(
      { where: { id: event.aggregate.id } },
      {
        participants: { [$pull]: { id: event.user.id } },
      },
    );
  }
}

export type GamesInterface = ListInterface<Game>;
