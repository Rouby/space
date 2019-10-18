import { DomainEvent } from '@eventing/core';
import { GalaxySize, GalaxyType } from '@space/types';

export class GameSettingsChanged extends DomainEvent<
  'GameSettingsChanged',
  {
    galaxyType?: GalaxyType;
    galaxySize?: GalaxySize;
    wormholes?: boolean;
    fogOfWar?: boolean;
  },
  true
> {}
