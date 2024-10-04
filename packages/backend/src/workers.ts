import { Worker } from "node:worker_threads";
import { pubSub } from "./pubSub.ts";

const workers: Worker[] = [];

export function startWorker(gameId: string) {
	const worker = new Worker(new URL(import.meta.resolve("@space/gameloop")), {
		execArgv: ["--experimental-strip-types"],
		workerData: { gameId },
	});

	worker.on("message", (message) => {
		if ("routingKey" in message && "args" in message) {
			pubSub.publish(message.routingKey, message.args);
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
