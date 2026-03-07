import { resources } from "@space/data/schema";
import { gameId } from "../config.ts";
import { generateRandomResources } from "../randomGameContent.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupResources(tx: Transaction, _ctx: Context) {
	console.log("Setting up resources...");

	const generated = generateRandomResources();

	await tx.insert(resources).values(
		generated.resources.map((resource) => ({
			gameId,
			name: resource.name,
			kind: resource.kind,
			description: resource.description,
			discoveryWeight: resource.discoveryWeight,
		})),
	);
}
