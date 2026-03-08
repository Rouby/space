import {
	and,
	eq,
	starSystemColonizations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickColonization(tx: Transaction, ctx: Context) {
	const nextTurn = ctx.turn + 1;

	const colonizations = await tx
		.select()
		.from(starSystemColonizations)
		.where(eq(starSystemColonizations.gameId, gameId));

	for (const colonization of colonizations) {
		if (colonization.dueTurn <= nextTurn) {
			const [updatedStarSystem] = await tx
				.update(starSystems)
				.set({ ownerId: colonization.playerId })
				.where(
					and(
						eq(starSystems.id, colonization.starSystemId),
						eq(starSystems.gameId, gameId),
					),
				)
				.returning({ id: starSystems.id, ownerId: starSystems.ownerId });

			await tx
				.delete(starSystemColonizations)
				.where(
					eq(starSystemColonizations.starSystemId, colonization.starSystemId),
				);

			if (updatedStarSystem?.ownerId) {
				ctx.postMessage({
					type: "starSystem:ownerChanged",
					id: updatedStarSystem.id,
					ownerId: updatedStarSystem.ownerId,
				});
			}

			continue;
		}

		ctx.postMessage({
			type: "starSystem:colonizationProgress",
			id: colonization.starSystemId,
			turnsRemaining: Math.max(colonization.dueTurn - nextTurn, 0),
		});
	}
}
