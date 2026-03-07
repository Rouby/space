import { createCompletion, prompts } from "@space/ai";
import { resources } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupResources(tx: Transaction, _ctx: Context) {
	console.log("Setting up resources...");

	const generated = await createCompletion({
		...prompts.resourceGeneration,
	});

	console.log(generated);

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
