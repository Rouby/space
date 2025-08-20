import {
	dilemmas,
	eq,
	resources,
	sql,
	starSystemPopulations,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupStartingConditions(tx: Transaction, ctx: Context) {
	console.log("Setting up starting conditions...");

	const generatedSystems = await tx
		.select()
		.from(starSystems)
		.where(eq(starSystems.gameId, gameId));

	const takenSystemIds = new Set();

	for (const player of ctx.players) {
		while (true) {
			const playerStar = Math.floor(Math.random() * generatedSystems.length);
			// TODO: other conditions, like distance etc.
			if (takenSystemIds.has(generatedSystems[playerStar].id)) {
				continue;
			}

			await tx
				.update(starSystems)
				.set({
					ownerId: player.userId,
					discoverySlots: 5,
				})
				.where(eq(starSystems.id, generatedSystems[playerStar].id));

			takenSystemIds.add(generatedSystems[playerStar].id);

			// discover one random resource
			const [resource] = await tx
				.select()
				.from(resources)
				.orderBy(sql`RANDOM()`)
				.limit(1);

			await tx.insert(starSystemResourceDiscoveries).values({
				starSystemId: generatedSystems[playerStar].id,
				resourceId: resource.id,
				discoveredAt: new Date(),
				remainingDeposits: "100000",
			});

			// generate starting population
			await tx.insert(starSystemPopulations).values({
				starSystemId: generatedSystems[playerStar].id,
				amount: 10_000_000_000n,
				allegianceToPlayerId: player.userId,
			});

			// create a starting dilemma
			const generatedDilemma = await ctx.ai.completions.create({
				prompt: `
You are a creative game designer for a complex 4X space opera game.
Your task is to generate a compelling, unique pre-game dilemma that helps a player define their starting species' culture, history, or biology.
The dilemma must not have a clear 'best' answer. Each choice should have meaningful trade-offs.
The dilemma should be general enough to not include specific species names or pheontypes and also be of limited scope.
This dilemma could have vaguely to do with the starting point of the players civilization space faring age.

You may also reference the discovered resource ${resource.name} (${resource.description.slice(0, resource.description.indexOf("."))}).

You may incorporate the following game mechanics:

[
  "popGrowth",
  "discoverySpeed",
  "resourceExploitationEfficiency",
  "resourceExploitationEffectiveness"
]

The dilemma should be in JSON and follow these specs:

{
	title: string;
	description: string;
	choices: {
    id: string;
    text: string;
    effectScript: string;
  }[];
}

The return should be in the structure of { dilemma: Dilemma }.
`,
				parse: (input) =>
					JSON.parse(input) as {
						dilemma: {
							title: string;
							description: string;
							choices: {
								id: string;
								text: string;
								effectScript: string;
							}[];
						};
					},
			});

			await tx.insert(dilemmas).values({
				gameId,
				ownerId: player.userId,
				correlation: {
					origin: "starSystems",
					id: generatedSystems[playerStar].id,
				},
				...generatedDilemma.dilemma,
			});

			break;
		}
	}
}
