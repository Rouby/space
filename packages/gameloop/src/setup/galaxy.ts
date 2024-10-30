import { starSystemPopulations, starSystems } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupGalaxy(tx: Transaction, ctx: Context) {
	console.log("Setting up galaxy...");

	const stars = generateSpiralPositions();

	const starSystemValues = stars.map(
		(position, idx) =>
			({
				gameId,
				position,
				name: `Star ${idx}`,
				ownerId: null as string | null,
				discoverySlots: 1 + Math.floor(Math.random() * 4),
			}) as typeof starSystems.$inferInsert,
	);

	for (const player of ctx.players) {
		while (true) {
			const playerStar = Math.floor(Math.random() * starSystemValues.length);
			// TODO: other conditions, like distance etc.
			if (starSystemValues[playerStar].ownerId) {
				continue;
			}
			starSystemValues[playerStar].ownerId = player.userId;
			starSystemValues[playerStar].discoverySlots = 5;
			break;
		}
	}

	const insertedSystems = await tx
		.insert(starSystems)
		.values(starSystemValues)
		.returning();

	for (const { id, ownerId } of insertedSystems.filter((s) => s.ownerId)) {
		await tx.insert(starSystemPopulations).values({
			starSystemId: id,
			amount: 10_000_000_000n,
			allegianceToPlayerId: ownerId,
		});
	}
}

function generateSpiralPositions() {
	const arms = 8;
	const armLength = 25;
	const size = 1000;
	const randomness = 150;
	const stars = Array.from({ length: arms }, (_, i) => i).flatMap((arm) =>
		Array.from({ length: armLength }, (_, i) => i + 3).map((star) => {
			const armOffset = arm / arms;
			return {
				id: `${arm}-${star}`,
				x:
					Math.cos((star * 2 * Math.PI) / 90 + Math.PI * 2 * armOffset) *
						Math.log10(star * star * star * star) *
						size +
					(randomness / 2 - Math.random() * randomness),
				y:
					Math.sin((star * 2 * Math.PI) / 90 + Math.PI * 2 * armOffset) *
						Math.log10(star * star * star * star) *
						size +
					(randomness / 2 - Math.random() * randomness),
			};
		}),
	);
	while (true) {
		const starNearOther = stars.find((star) => {
			return stars.some((otherStar) => {
				const distance = Math.sqrt(
					(star.x - otherStar.x) ** 2 + (star.y - otherStar.y) ** 2,
				);
				return distance < 20 && star.id !== otherStar.id;
			});
		});
		if (!starNearOther) {
			break;
		}
		stars.splice(stars.indexOf(starNearOther), 1);
	}
	return stars;
}
