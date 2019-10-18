import { Game, GameInterface } from './Game';
import { StarSystem, StarSystemInterface } from './StarSystem';

export default {
  Game,
  StarSystem,
};

export type ClientWrites = {
  Game: GameInterface;
  StarSystem: StarSystemInterface;
};
