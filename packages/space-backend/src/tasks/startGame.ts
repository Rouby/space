import { JobHelpers } from 'graphile-worker';

export async function startGame(
  { gameId }: { gameId: string },
  helpers: JobHelpers,
) {
  helpers.logger.info(`Start game ${gameId}`);

  await helpers.withPgClient(async (pg) => {
    await pg.query(
      'insert into space.planet (game_id, name, class, position) values ($1, $2, $3, ($4, $5)::space.vector2)',
      [gameId, ...['Planet', 'class_m', 0, 0]],
    );
  });

  await helpers.withPgClient(async (pg) => {
    await pg.query('update space.game set started = now() where id = $1', [
      gameId,
    ]);
  });
}
