import { DomainEvent } from '@rouby/eventing';

export class GameDeleted extends DomainEvent<'GameDeleted', {}, true> {}
