import { workerData } from "node:worker_threads";

const configuredGameId =
	(workerData as { gameId?: string } | undefined)?.gameId ??
	process.env.GAME_ID;

if (!configuredGameId) {
	throw new Error("Missing gameId in workerData and GAME_ID env var");
}

export const gameId = configuredGameId;
