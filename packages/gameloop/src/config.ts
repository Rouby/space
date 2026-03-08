import { workerData } from "node:worker_threads";

const configuredGameId =
	(workerData as { gameId?: string } | undefined)?.gameId ??
	process.env.GAME_ID;

const fallbackGameId = process.env.VITEST ? "test-game-id" : undefined;
const resolvedGameId = configuredGameId ?? fallbackGameId;

if (!resolvedGameId) {
	throw new Error("Missing gameId in workerData and GAME_ID env var");
}

export const gameId: string = resolvedGameId;
