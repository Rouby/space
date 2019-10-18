import { DomainEvent } from '@eventing/core';

export class JoinedGame extends DomainEvent<
  'JoinedGame',
  {
    color: string;
  }
> {}
