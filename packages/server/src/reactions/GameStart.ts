import { Reaction } from '@eventing/core';
import { StarType } from '@space/types';
import { generateSystemPositions, starSystemName } from '@space/utils';
import * as random from 'random';
import { GameStarted } from '../events';
import { ReactionInterface } from '../reactionInterface';

export default class GameStart {
  @Reaction
  SpawnSystems({ aggregates }: ReactionInterface, event: GameStarted) {
    const habitablePlanets = (() => {
      const gn = random.normal(1, 5);
      return () => Math.ceil(Math.max(0, gn()));
    })();
    const inhabitablePlanets = (() => {
      const gn = random.normal(5, 3);
      return () => Math.floor(Math.max(0, gn()));
    })();
    const systems = generateSystemPositions(
      event.data.galaxyType,
      event.data.galaxySize,
    ).map(({ x, y }) =>
      aggregates
        .StarSystem()
        .spawn(
          event.aggregate.id,
          starSystemName(),
          { x: x * 10, y: y * 10 },
          [StarType.G],
          habitablePlanets(),
          inhabitablePlanets(),
        ),
    );

    event.data.participants.forEach((user, idx) =>
      systems[idx].transferOwnership(user.id),
    );
  }
}
