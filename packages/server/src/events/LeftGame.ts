import { DomainEvent } from '@eventing/core';

export class LeftGame extends DomainEvent<'LeftGame', {}, true> {}
