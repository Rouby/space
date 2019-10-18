import { DomainEvent } from '@eventing/core';

export class GameCreated extends DomainEvent<
  'GameCreated',
  {
    name: string;
    password: string | null;
    playerSlots: number;
  }
> {}
