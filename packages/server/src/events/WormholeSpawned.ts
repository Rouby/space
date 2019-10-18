import { DomainEvent } from '@eventing/core';

export class WormholeSpawned extends DomainEvent<
  'WormholeSpawned',
  {
    name: string;
    origin: { x: number; y: number };
    destination?: { x: number; y: number };
    twoway?: boolean;
  },
  null
> {}
