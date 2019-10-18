import {
  List,
  ListEntry,
  OwnershipDeclared,
  Projection,
  Property,
} from '@eventing/core';
import { StarSystemSpawned } from '../events';

export class StarSystem extends ListEntry {
  @Property()
  name!: string;

  @Property()
  gameId!: string;
}

export class StarSystems extends List<StarSystem> {
  get hasVisibility() {
    return true;
  }

  @Projection
  onSpawn(event: StarSystemSpawned) {
    this.add({
      name: event.data.name,
      gameId: event.data.gameId,
    });
  }

  @Projection
  onOwned(event: OwnershipDeclared) {
    this.grantVisibility(event.aggregate.id);
  }
}
