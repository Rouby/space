import { JobHelpers } from 'graphile-worker';

export async function startGame(
  { gameId }: { gameId: string },
  helpers: JobHelpers,
) {
  helpers.logger.info(`Start game ${gameId}`);

  await helpers.withPgClient(async (client) => {
    await client.query('update space.game set started = now() where id = $1', [
      gameId,
    ]);
  });
}
