import {
  Aggregate,
  AggregateInterface,
  Command,
  CommandInterface,
  CommandRejected,
} from '@eventing/core';
import { StarType } from '@space/types';
import { StarSystemSpawned } from '../events';

export class StarSystem extends Aggregate<{
  name: string;
  position: { x: number; y: number };
  stars: StarType[];
  habitablePlanets: number;
  inhabitablePlanets: number;
}> {
  initialState() {
    return {
      name: '',
      position: { x: 0, y: 0 },
      stars: [],
      habitablePlanets: 0,
      inhabitablePlanets: 0,
    };
  }

  @Command()
  spawn(
    { events }: CommandInterface,
    gameId: string,
    name: string,
    position: { x: number; y: number },
    stars: StarType[],
    habitablePlanets: number,
    inhabitablePlanets: number,
  ) {
    if (!name) {
      throw new CommandRejected('No name given.');
    }

    events.publish<StarSystemSpawned>('StarSystemSpawned', {
      gameId,
      name,
      position,
      stars,
      habitablePlanets,
      inhabitablePlanets,
    });
  }
}

export type StarSystemInterface = AggregateInterface<StarSystem>;
