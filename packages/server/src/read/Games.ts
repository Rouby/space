import { List, ListInterface, Projection, Property } from '@rouby/eventing';
import { GameCreated } from '../events';

export class Game {
  @Property()
  id = '';

  @Property({
    needsAuthorization: true,
  })
  name = '';

  @Property({
    needsAuthorization: true,
  })
  password: string | null = null;
}

export class Games extends List<Game> {
  @Projection
  onCreate(event: GameCreated) {
    this.add({
      id: event.aggregate.id,
      name: event.data.name,
      password: event.data.password,
    });
  }
}

export type GamesInterface = ListInterface<Game>;
