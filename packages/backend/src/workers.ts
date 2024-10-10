import { Worker } from "node:worker_threads";
import { Subject, from } from "rxjs";
import type { GameEvent } from "./events.ts";

const eventsPerGame = new Map<string, Subject<GameEvent>>();

const workers: Worker[] = [];

export function startWorker(gameId: string) {
	const worker = new Worker(new URL(import.meta.resolve("@space/gameloop")), {
		execArgv: ["--experimental-strip-types"],
		workerData: { gameId },
	});

	const subject = eventsPerGame.get(gameId) ?? new Subject<GameEvent>();
	eventsPerGame.set(gameId, subject);

	worker.on("message", (message) => {
		subject.next(message);
	});

	workers.push(worker);
}

export async function stopWorkers() {
	return Promise.all([
		...workers.map((worker) => {
			const promise = new Promise((res) => worker.once("exit", res));
			worker.postMessage("shutdown");
			return promise;
		}),
	]);
}

export function fromGameEvents(gameId: string) {
	const subject = eventsPerGame.get(gameId) ?? new Subject<GameEvent>();
	if (!eventsPerGame.has(gameId)) {
		eventsPerGame.set(gameId, subject);
	}

	return from(subject);
}
