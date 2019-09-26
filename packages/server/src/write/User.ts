import {
  Aggregate,
  AggregateInterface,
  Command,
  CommandInterface,
  CommandRejected,
  EventHandler,
} from '@rouby/eventing';
import { UserSignedIn, UserSignedUp } from '../events';

export class User extends Aggregate<{
  name: string;
  email: string;
}> {
  initialState() {
    return {
      name: '',
      email: '',
    };
  }

  @Command({ needsAuthorization: true })
  signUp({ events }: CommandInterface, name: string, email: string) {
    if (!name) {
      throw new CommandRejected('No name given.');
    }

    events.publish(new UserSignedUp(name, email));
  }

  @Command({ needsAuthorization: true })
  async signIn({ events }: CommandInterface) {
    console.log(this.currentState.name, 'logged in');
    events.publish(new UserSignedIn());
  }

  @EventHandler
  onSignUp(event: UserSignedUp) {
    this.setState(s => ({
      ...s,
      name: event.name,
      email: event.email,
    }));
  }
}

export type UserInterface = AggregateInterface<User>;
