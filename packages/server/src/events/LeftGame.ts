import { DomainEvent } from '@rouby/eventing';

export class LeftGame extends DomainEvent<'LeftGame', {}, true> {}
