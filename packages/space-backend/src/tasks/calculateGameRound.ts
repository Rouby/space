import { JobHelpers } from 'graphile-worker';

export async function calculateGameRound(
  { gameId }: { gameId: string },
  helpers: JobHelpers,
) {
  const {
    rows,
  } = await helpers.query(
    'select turn_ended from space.player where game_id = $1',
    [gameId],
  );

  const allEndedTurn = rows.every((p) => p.turn_ended);

  if (!allEndedTurn) {
    helpers.logger.info(
      `Not all players have ended their turn in game ${gameId}`,
    );
    return;
  }

  helpers.logger.info(`All players in ${gameId} ended their turn`);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await helpers.query(
    'update space.player set turn_ended = false where game_id = $1',
    [gameId],
  );
}
