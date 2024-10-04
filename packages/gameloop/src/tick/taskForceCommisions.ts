import { eq, sql, taskForceCommisions, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceCommisions(tx: Transaction, ctx: Context) {
	const commisions = await tx.query.taskForceCommisions.findMany({
		where: eq(taskForceCommisions.gameId, gameId),
		with: { starSystem: true },
	});

	for (const commision of commisions) {
		const progress = commision.progress + 1;

		if (progress >= commision.total) {
			await tx
				.delete(taskForceCommisions)
				.where(eq(taskForceCommisions.id, commision.id));

			const taskForce = await tx
				.insert(taskForces)
				.values({
					gameId: gameId,
					name: "Task Force",
					position: commision.starSystem.position,
					ownerId: commision.starSystem.ownerId ?? "",
					orders: [],
				})
				.returning();

			ctx.postMessage("taskForceCommisionCompleted", {
				id: commision.id,
				taskForceId: taskForce[0].id,
			});
		} else {
			await tx
				.update(taskForceCommisions)
				.set({ progress: sql`${taskForceCommisions.progress} + 1` })
				.where(eq(taskForceCommisions.id, commision.id));

			ctx.postMessage("taskForceCommisionProgress", {
				id: commision.id,
				progress,
				total: commision.total,
			});
		}
	}
}
