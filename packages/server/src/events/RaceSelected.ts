import { DomainEvent } from '@eventing/core';

export class RaceSelected extends DomainEvent<
  'RaceSelected',
  {
    id: string;
  },
  true
> {}
