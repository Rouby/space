import { and, eq, isNull, starSystems, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export type IndustryTurnChange = {
	starSystemId: string;
	industryTotal: number;
	industryUtilized: number;
};

export async function tickTaskForceConstruction(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			name: taskForces.name,
			ownerId: taskForces.ownerId,
			gameId: taskForces.gameId,
			constructionStarSystemId: taskForces.constructionStarSystemId,
			constructionDone: taskForces.constructionDone,
			constructionTotal: taskForces.constructionTotal,
		})
		.from(taskForces)
		.where(and(eq(taskForces.gameId, gameId), isNull(taskForces.deletedAt)));

	const systemsWithIndustry = await tx
		.select({
			id: starSystems.id,
			industry: starSystems.industry,
		})
		.from(starSystems)
		.where(eq(starSystems.gameId, gameId));

	for (const system of systemsWithIndustry) {
		const forcesInSystem = allTaskForces.filter(
			(tf) =>
				tf.constructionStarSystemId === system.id &&
				Number(tf.constructionTotal ?? "0") >
					Number(tf.constructionDone ?? "0"),
		);

		if (forcesInSystem.length === 0) {
			ctx.addIndustryChange({
				starSystemId: system.id,
				industryTotal: system.industry,
				industryUtilized: 0,
			});
			continue;
		}

		const availableIndustry = system.industry;
		let utilizedIndustry = 0;

		const perShip = Math.floor(availableIndustry / forcesInSystem.length);
		let remainder = availableIndustry % forcesInSystem.length;

		for (const taskForce of forcesInSystem) {
			const done = Number(taskForce.constructionDone ?? "0");
			const total = Number(taskForce.constructionTotal ?? "0");

			let industryApplied = perShip + (remainder > 0 ? 1 : 0);
			if (remainder > 0) remainder--;

			if (done + industryApplied > total) {
				industryApplied = total - done;
				// In a perfect system we would re-add the leftover to availableIndustry
				// for outer loop distribution, but a simple cap is fine for now.
			}

			if (industryApplied <= 0) continue;

			utilizedIndustry += industryApplied;
			const nextDone = done + industryApplied;

			await tx
				.update(taskForces)
				.set({ constructionDone: nextDone.toString() })
				.where(
					and(
						eq(taskForces.id, taskForce.id),
						eq(taskForces.gameId, taskForce.gameId),
						isNull(taskForces.deletedAt),
					),
				);

			if (taskForce.constructionStarSystemId) {
				ctx.addTaskForceConstructionChange?.({
					taskForceId: taskForce.id,
					taskForceName: taskForce.name,
					ownerId: taskForce.ownerId,
					starSystemId: taskForce.constructionStarSystemId,
					previousDone: done,
					newDone: nextDone,
					total,
					perTick: industryApplied,
					completed: nextDone >= total,
				});

				ctx.postMessage({
					type: "taskForceCommision:progress",
					id: taskForce.id,
					starSystemId: taskForce.constructionStarSystemId,
					constructionDone: nextDone,
					constructionTotal: total,
					constructionPerTick: industryApplied,
				});
			}
		}

		ctx.addIndustryChange({
			starSystemId: system.id,
			industryTotal: system.industry,
			industryUtilized: utilizedIndustry,
		});
	}
}
