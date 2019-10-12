import { Client as EventingClient } from '@rouby/eventing';
import { GameOverviewsInterface } from './read/GameOverviews';
import { GamesInterface } from './read/Games';
import { GameInterface } from './write/Game';

export default class Client extends EventingClient<
  { GameOverviews: GameOverviewsInterface; Games: GamesInterface },
  { Game: GameInterface }
> {}
