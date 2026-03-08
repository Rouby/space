import { and, eq, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceConstruction(tx: Transaction, ctx: Context) {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			gameId: taskForces.gameId,
			constructionStarSystemId: taskForces.constructionStarSystemId,
			constructionDone: taskForces.constructionDone,
			constructionTotal: taskForces.constructionTotal,
			constructionPerTick: taskForces.constructionPerTick,
		})
		.from(taskForces)
		.where(eq(taskForces.gameId, gameId));

	for (const taskForce of allTaskForces) {
		const done = Number(taskForce.constructionDone ?? "0");
		const total = Number(taskForce.constructionTotal ?? "0");
		const perTick = Number(taskForce.constructionPerTick ?? "0");

		if (!(total > 0) || done >= total) {
			continue;
		}

		const nextDone = Math.min(total, done + Math.max(perTick, 0));

		await tx
			.update(taskForces)
			.set({ constructionDone: nextDone.toString() })
			.where(
				and(
					eq(taskForces.id, taskForce.id),
					eq(taskForces.gameId, taskForce.gameId),
				),
			);

		if (taskForce.constructionStarSystemId) {
			ctx.postMessage({
				type: "taskForceCommision:progress",
				id: taskForce.id,
				starSystemId: taskForce.constructionStarSystemId,
				constructionDone: nextDone,
				constructionTotal: total,
				constructionPerTick: Math.max(perTick, 0),
			});
		}
	}
}
