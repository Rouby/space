import { DomainEvent } from './DomainEvent';

export class PrivilegesGranted extends DomainEvent<
  'PrivilegesGranted',
  { command?: string; eventName?: string; eventId?: string }
> {}
export class PrivilegesStripped extends DomainEvent<
  'PrivilegesStripped',
  { command?: string; eventName?: string; eventId?: string }
> {}
export class OwnershipDeclared extends DomainEvent<
  'OwnershipDeclared',
  { newOwnerId: string }
> {}
