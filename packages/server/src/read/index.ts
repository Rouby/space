import { GameOverviews } from './GameOverviews';
import { Games } from './Games';
import { StarSystems } from './StarSystems';
import { ListInterface } from '@eventing/core';

export default {
  GameOverviews,
  Games,
  StarSystems,
};

export type ClientReads = {
  GameOverviews: ListInterface<GameOverviews>;
  Games: ListInterface<Games>;
  StarSystems: ListInterface<StarSystems>;
};
