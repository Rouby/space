import { DomainEvent } from '@eventing/core';
import { StarType } from '@space/types';

export class StarSystemSpawned extends DomainEvent<
  'StarSystemSpawned',
  {
    gameId: string;
    name: string;
    position: { x: number; y: number };
    stars: StarType[];
    habitablePlanets: number;
    inhabitablePlanets: number;
  },
  null
> {}
