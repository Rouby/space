import { chats, createChat } from "@space/ai";
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
		.select({ id: starSystems.id })
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
			const generated = await createChat({
				messages: [...chats.startingDilemmas.startingMessages],
				format: chats.startingDilemmas.format,
			});

			console.log(generated);

			await tx.insert(dilemmas).values({
				gameId,
				ownerId: player.userId,
				correlation: {
					origin: "starSystems",
					id: generatedSystems[playerStar].id,
				},
				...generated.dilemma,
				choices: generated.dilemma.choices.map(
					({ effectScript, ...choice }) => ({
						...choice,
						effects: [
							{
								type: "generateDilemma",
								params: {
									promptName: "startingDilemmaFollowUp1",
								},
							},
							// TODO: add effectScript as effect
						],
					}),
				),
			});

			break;
		}
	}
}
