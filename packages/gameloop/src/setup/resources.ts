import { resources } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupResources(tx: Transaction, _ctx: Context) {
	console.log("Setting up resources...");

	const generated = await _ctx.ai.completions.create({
		prompt: `
You are a creative game designer for a complex 4X space opera game.
Your task is to generate a list of resources for this game. The game knows the following kinds of resources:

[
	"metal",
	"crystal",
	"gas",
	"liquid",
	"biological",
]

There should not be a clear 'best' resource and you should generate a compelling description for each resource and discovery weight should factor in its rareness. Verify that the description matches its kind.

Be sure to generate atleast 3 random resources PER kind for a total of 20 resources.

The resources should be in JSON and follow these specs:

{
	name: string;
	kind: ResourceKind;
	description: string;
	discoveryWeight: integer;
}

The return should be in the structure of { resources: Resource[] }.
`,
		parse: (input) =>
			JSON.parse(input) as {
				resources: {
					name: string;
					kind: "metal" | "crystal" | "gas" | "liquid" | "biological";
					description: string;
					discoveryWeight: number;
				}[];
			},
	});

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
