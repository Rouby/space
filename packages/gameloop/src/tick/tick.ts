import { parentPort } from "node:worker_threads";
import type { GameEvent } from "../../../backend/src/events.ts";
import { drizzle } from "../db.ts";
import { tickTaskForceCommisions } from "./taskForceCommisions.ts";
import { tickTaskForceMovements } from "./taskForceMovements.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = {
	postMessage: (event: GameEvent) => void;
};

export async function tick() {
	const messages: GameEvent[] = [];
	const ctx: Context = {
		postMessage: (event) => messages.push(event),
	};

	await drizzle.transaction(async (tx) => {
		await tickTaskForceCommisions(tx, ctx);

		await tickTaskForceMovements(tx, ctx);
	});

	for (const message of messages) {
		parentPort?.postMessage(message);
	}
}
