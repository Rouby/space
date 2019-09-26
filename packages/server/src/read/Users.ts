import { List, ListInterface, Projection, Property } from '@rouby/eventing';
import { UserSignedUp } from '../events/UserSignedUp';

export class User {
  @Property({
    isPersonalIdentifiableInformation: true,
  })
  name = '';

  @Property({
    isPersonalIdentifiableInformation: true,
    needsAuthorization: true,
  })
  email = '';
}

export class Users extends List<User> {
  @Projection
  onSignUp(event: UserSignedUp) {
    this.add({
      name: event.name,
      email: event.email,
    });
  }
}

export type UsersInterface = ListInterface<User>;
