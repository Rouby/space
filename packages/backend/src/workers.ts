import type { PubSubEventTarget } from "graphql-yoga";
import { Worker } from "node:worker_threads";
import type { PubSubPublishArgsByKey } from "./pubSub.ts";

const workers: Worker[] = [];
const callbacks = new Map<string, ((payload: unknown) => void)[]>();

export function startWorker(gameId: string) {
	const worker = new Worker(new URL(import.meta.resolve("@space/gameloop")), {
		execArgv: ["--experimental-strip-types"],
		workerData: { gameId },
	});

	worker.on("message", (message) => {
		if ("routingKey" in message && "args" in message) {
			const listeners = callbacks.get(message.routingKey) || [];
			for (const listener of listeners) {
				listener({ detail: message.args });
			}
		}
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

export const eventTarget: PubSubEventTarget<PubSubPublishArgsByKey> = {
	addEventListener(type, callbackOrOptions) {
		callbacks.set(type, [
			...(callbacks.get(type) || []),
			callbackOrOptions as (payload: unknown) => void,
		]);
	},
	dispatchEvent(event) {
		console.log("TODO implement?", event);
		// for (const worker of workers) {
		// 	worker.postMessage(event.detail);
		// }
		return true;
	},
	removeEventListener(type, callbackOrOptions) {
		const listeners = callbacks.get(type) || [];
		const index = listeners.indexOf(
			callbackOrOptions as (payload: unknown) => void,
		);
		if (index !== -1) {
			listeners.splice(index, 1);
		}
	},
};
