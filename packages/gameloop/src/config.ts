import { workerData } from "node:worker_threads";

export const gameId = workerData.gameId as string;
