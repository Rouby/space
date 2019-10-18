import { Game } from './Game';
import { StarSystem } from './StarSystem';
import { AggregateInterface, AggregarteServerInterface } from '@eventing/core';

export default {
  Game,
  StarSystem,
};

export type ClientWrites = {
  Game: AggregateInterface<Game>;
  StarSystem: AggregateInterface<StarSystem>;
};

export type ServerWrites = {
  Game: AggregarteServerInterface<Game>;
  StarSystem: AggregarteServerInterface<StarSystem>;
};
