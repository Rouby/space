import { DomainEvent } from '@eventing/core';
import { GalaxyType, GalaxySize } from '@space/types';

export class GameStarted extends DomainEvent<
  'GameStarted',
  {
    galaxyType: GalaxyType;
    galaxySize: GalaxySize;
    wormholes: boolean;
    fogOfWar: boolean;
  },
  true
> {}
