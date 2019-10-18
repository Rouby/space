import { GameOverviews, GameOverviewsInterface } from './GameOverviews';
import { Games, GamesInterface } from './Games';

export default {
  GameOverviews,
  Games,
};

export type ClientReads = {
  GameOverviews: GameOverviewsInterface;
  Games: GamesInterface;
};
