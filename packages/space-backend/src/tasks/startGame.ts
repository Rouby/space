import { JobHelpers } from 'graphile-worker';
import random from 'random';
import { generateGalaxyPositions, generateNames } from '../generators';

export async function startGame(
  { gameId }: { gameId: string },
  helpers: JobHelpers,
) {
  helpers.logger.info(`Start game ${gameId}`);

  const {
    rows: [game],
  } = await helpers.query('select * from space.game where id = $1', [gameId]);

  // generate random positions to be used for planets / systems

  const positions = generateGalaxyPositions(game.type, game.size);
  const names = generateNames('planets', positions.length);

  const planets = Array.from(positions).map((_, idx) => ({
    name: names[idx],
    class: 'class_m',
    position: [positions[idx].x, positions[idx].y],
    ownerId: null,

    declaration(offset: number) {
      return [
        `$${2 + offset}`, // name
        `$${3 + offset}`, // class
        `($${4 + offset}, $${5 + offset})::space.vector2`, // position
        `$${6 + offset}`, // owner
      ];
    },
    values() {
      return [
        this.name,
        this.class,
        this.position[0],
        this.position[1],
        this.ownerId,
      ];
    },
  }));

  // select a random planet for each player

  const {
    rows: players,
  } = await helpers.query(
    'select person_id from space.player where game_id = $1',
    [gameId],
  );

  for (const player of players) {
    let idx = random.int(0, planets.length - 1);
    while (planets[idx].ownerId) {
      idx = random.int(0, planets.length - 1);
    }
    planets[idx].ownerId = player.person_id;
  }

  // insert planets into db

  const bulkSize = 100;
  for (const bunch of Array.from({
    length: Math.ceil(planets.length / bulkSize),
  }).map((_, idx) =>
    planets.slice(idx * bulkSize, idx * bulkSize + bulkSize),
  )) {
    const queryStr = bunch
      .map(
        (p, idx) =>
          `($1, ${p.declaration(idx * p.values().length).join(', ')})`,
      )
      .join(', ');

    helpers.logger.info(queryStr);

    await helpers.query(
      `insert into space.planet (game_id, name, class, position, owner_id) values ${queryStr}`,
      [gameId, ...bunch.flatMap((p) => p.values())],
    );
  }

  await helpers.query('update space.game set started = now() where id = $1', [
    gameId,
  ]);
}
