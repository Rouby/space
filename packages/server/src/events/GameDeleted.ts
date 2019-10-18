import { DomainEvent } from '@eventing/core';

export class GameDeleted extends DomainEvent<'GameDeleted', {}> {}
