import { DomainEvent } from '@rouby/eventing';

export class JoinedGame extends DomainEvent<'JoinedGame', {}, true> {}
