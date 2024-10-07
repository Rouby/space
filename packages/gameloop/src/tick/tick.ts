import { parentPort } from "node:worker_threads";
import type { PubSubPublishArgsByKey } from "../../../backend/src/pubSub.ts";
import { drizzle } from "../db.ts";
import { tickTaskForceCommisions } from "./taskForceCommisions.ts";
import { tickTaskForceMovements } from "./taskForceMovements.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = {
	postMessage: <TKey extends keyof PubSubPublishArgsByKey>(
		routingKey: TKey,
		args: PubSubPublishArgsByKey[TKey][0],
	) => void;
};

export async function tick() {
	const messages: { routingKey: string; args: unknown }[] = [];
	const ctx: Context = {
		postMessage: (routingKey, args) => messages.push({ routingKey, args }),
	};

	await drizzle.transaction(async (tx) => {
		await tickTaskForceCommisions(tx, ctx);

		await tickTaskForceMovements(tx, ctx);
	});

	for (const message of messages) {
		parentPort?.postMessage(message);
	}
}
