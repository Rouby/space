import { JobHelpers } from 'graphile-worker';
import { generateGalaxyPositions, generateNames } from '../generators';

export async function startGame(
  { gameId }: { gameId: string },
  helpers: JobHelpers,
) {
  helpers.logger.info(`Start game ${gameId}`);

  const {
    rows: [game],
  } = await helpers.query('select * from space.game where id = $1', [gameId]);

  const positions = generateGalaxyPositions(game.type, game.size);
  const names = generateNames('planets', positions.length);

  const planets = Array.from(positions).map(
    (_, idx) =>
      [names[idx], 'class_m', positions[idx].x, positions[idx].y] as const,
  );

  const bulkSize = 100;
  for (const bunch of Array.from({
    length: Math.ceil(planets.length / bulkSize),
  }).map((_, idx) =>
    planets.slice(idx * bulkSize, idx * bulkSize + bulkSize),
  )) {
    const queryStr = bunch
      .map((_, idx) => {
        const o = idx * _.length;
        return `($1, $${2 + o}, $${3 + o}, ($${4 + o}, $${
          5 + o
        })::space.vector2)`;
      })
      .join(', ');

    await helpers.query(
      `insert into space.planet (game_id, name, class, position) values ${queryStr}`,
      [gameId, ...bunch.flat()],
    );
  }

  await helpers.query('update space.game set started = now() where id = $1', [
    gameId,
  ]);
}
