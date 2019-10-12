import { DomainEvent } from '@rouby/eventing';

export class GameCreated extends DomainEvent<
  'GameCreated',
  {
    name: string;
    password: string | null;
  },
  true
> {}
