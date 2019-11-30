import { List, ListEntry, Projection, Property } from '@eventing/core';
import { StarSystemSpawned } from '../events';

export class StarSystem extends ListEntry {
  @Property()
  name!: string;

  @Property()
  gameId!: string;

  @Property()
  position!: { x: number; y: number };
}

export class StarSystems extends List<StarSystem> {
  @Projection
  onSpawn(event: StarSystemSpawned) {
    this.add({
      name: event.data.name,
      gameId: event.data.gameId,
      position: event.data.position,
    });
  }
}
