import { Worker } from "node:worker_threads";
import { from, Subject } from "rxjs";
import type { GameEvent } from "./events.ts";

const eventsPerGame = new Map<string, Subject<GameEvent>>();
const workerPerGame = new Map<string, Worker>();

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

	workerPerGame.set(gameId, worker);
}

export async function stopWorkers() {
	return Promise.all([
		...workerPerGame.values().map((worker) => {
			const promise = new Promise((res) => worker.once("exit", res));
			worker.postMessage({ type: "shutdown" });
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

export function emitGameEvent(gameId: string, event: GameEvent) {
	const subject = eventsPerGame.get(gameId) ?? new Subject<GameEvent>();
	if (!eventsPerGame.has(gameId)) {
		eventsPerGame.set(gameId, subject);
	}

	subject.next(event);
}

export function notifyWorker(gameId: string, event: unknown) {
	workerPerGame.get(gameId)?.postMessage({ type: "notify", event });
}
