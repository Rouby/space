import { Client as EventingClient } from '@rouby/eventing';
import { GamesInterface } from './read/Games';
import { UsersInterface } from './read/Users';
import { GameInterface } from './write/Game';
import { UserInterface } from './write/User';

export default class Client extends EventingClient<
  { Users: UsersInterface; Games: GamesInterface },
  { User: UserInterface; Game: GameInterface }
> {}
