import { DomainEvent } from '@rouby/eventing';

export class UserSignedUp extends DomainEvent {
  constructor(public readonly name: string, public readonly email: string) {
    super();
  }
}
