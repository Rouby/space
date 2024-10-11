import {
	aliasedTable,
	and,
	eq,
	exists,
	not,
	notExists,
	or,
	sql,
	taskForceEngagements,
	taskForceEngagementsToTaskForces,
	taskForces,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceEngagements(tx: Transaction, ctx: Context) {
	// 1. join any task forces to existing engagements
	// 2. check for new engagements between task forces not already in an engagement
	// 3. calculate the outcome of any engagements

	const engagementsWithTaskForcesInRange = await tx
		.select({
			id: taskForceEngagements.id,
			taskForces: sql<string[]>`json_agg(${taskForces.id})`,
		})
		.from(taskForces)
		.where(
			and(
				eq(taskForces.gameId, gameId),
				notExists(
					tx
						.select()
						.from(taskForceEngagementsToTaskForces)
						.where(
							eq(taskForceEngagementsToTaskForces.taskForceId, taskForces.id),
						),
				),
			),
		)
		.innerJoin(
			taskForceEngagements,
			and(
				eq(taskForceEngagements.gameId, gameId),
				sql`${taskForceEngagements.position} <-> ${taskForces.position} < 20`,
			),
		)
		.groupBy(taskForceEngagements.id);

	for (const { id, taskForces } of engagementsWithTaskForcesInRange.filter(
		(eng) => eng.taskForces.length > 0,
	)) {
		await tx.insert(taskForceEngagementsToTaskForces).values(
			taskForces.map((taskForceId) => ({
				taskForceEngagementId: id,
				taskForceId,
			})),
		);

		for (const taskForceId of taskForces) {
			ctx.postMessage({
				type: "taskForceEngagement:taskForceJoined",
				id,
				taskForceId,
			});
		}
	}

	const taskForcesA = aliasedTable(taskForces, "taskForcesA");
	const taskForcesB = aliasedTable(taskForces, "taskForcesB");

	const taskForcesInRangeOfEachOther = await tx
		.selectDistinct({
			taskForceIdA: sql<string>`least(${taskForcesA.id}, ${taskForcesB.id})`.as(
				"taskForceIdA",
			),
			taskForceIdB:
				sql<string>`greatest(${taskForcesA.id}, ${taskForcesB.id})`.as(
					"taskForceIdB",
				),
		})
		.from(taskForcesA)
		.where(
			and(
				eq(taskForcesA.gameId, gameId),
				notExists(
					tx
						.select()
						.from(taskForceEngagementsToTaskForces)
						.where(
							eq(taskForceEngagementsToTaskForces.taskForceId, taskForcesA.id),
						),
				),
			),
		)
		.innerJoin(
			taskForcesB,
			and(
				eq(taskForcesA.gameId, taskForcesB.gameId),
				not(eq(taskForcesA.id, taskForcesB.id)),
				not(eq(taskForcesA.ownerId, taskForcesB.ownerId)),
				sql`${taskForcesA.position} <-> ${taskForcesB.position} < 20`,
				notExists(
					tx
						.select()
						.from(taskForceEngagementsToTaskForces)
						.where(
							eq(taskForceEngagementsToTaskForces.taskForceId, taskForcesB.id),
						),
				),
			),
		);

	for (const { taskForceIdA, taskForceIdB } of taskForcesInRangeOfEachOther) {
		const [tfA, tfB] = await tx
			.select()
			.from(taskForces)
			.where(
				or(eq(taskForces.id, taskForceIdA), eq(taskForces.id, taskForceIdB)),
			);

		const middle = {
			x: (tfA.position.x + tfB.position.x) / 2,
			y: (tfA.position.y + tfB.position.y) / 2,
		};

		const engagement = await tx
			.insert(taskForceEngagements)
			.values({
				gameId,
				position: middle,
				startedAt: new Date(),
			})
			.returning();

		await tx.insert(taskForceEngagementsToTaskForces).values([
			{
				taskForceEngagementId: engagement[0].id,
				taskForceId: tfA.id,
			},
			{
				taskForceEngagementId: engagement[0].id,
				taskForceId: tfB.id,
			},
		]);

		ctx.postMessage({
			type: "taskForceEngagement:started",
			id: engagement[0].id,
			taskForceIdA: tfA.id,
			taskForceIdB: tfB.id,
			position: middle,
		});
	}

	const engagements = await tx
		.select()
		.from(taskForceEngagements)
		.where(eq(taskForceEngagements.gameId, gameId));

	for (const engagement of engagements) {
		console.log(engagement);
		switch (engagement.phase) {
			case "locating": {
				const phaseProgress = engagement.phaseProgress + 0.1;

				if (phaseProgress >= 1) {
					await tx
						.update(taskForceEngagements)
						.set({
							phaseProgress: 0,
							phase: "engagement",
						})
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:changePhase",
						id: engagement.id,
						phase: "engagement",
					});
				} else {
					await tx
						.update(taskForceEngagements)
						.set({
							phaseProgress,
						})
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:phaseProgress",
						id: engagement.id,
						phaseProgress,
					});
				}

				break;
			}

			case "engagement": {
				const phaseProgress = engagement.phaseProgress + 0.1;

				if (phaseProgress >= 1) {
					await tx
						.update(taskForceEngagements)
						.set({
							phaseProgress: 0,
							phase: "resolution",
						})
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:changePhase",
						id: engagement.id,
						phase: "resolution",
					});
				} else {
					await tx
						.update(taskForceEngagements)
						.set({
							phaseProgress,
						})
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:phaseProgress",
						id: engagement.id,
						phaseProgress,
					});
				}

				break;
			}

			case "resolution": {
				const phaseProgress = engagement.phaseProgress + 0.1;

				if (phaseProgress >= 1) {
					const tfs = await tx
						.select()
						.from(taskForces)
						.where(
							exists(
								tx
									.select()
									.from(taskForceEngagementsToTaskForces)
									.where(
										and(
											eq(
												taskForceEngagementsToTaskForces.taskForceEngagementId,
												engagement.id,
											),
											eq(
												taskForceEngagementsToTaskForces.taskForceId,
												taskForces.id,
											),
										),
									),
							),
						);

					const winnerId = tfs[Math.floor(Math.random() * tfs.length)].ownerId;

					for (const tf of tfs) {
						if (tf.ownerId !== winnerId) {
							await tx.delete(taskForces).where(eq(taskForces.id, tf.id));

							ctx.postMessage({
								type: "taskForce:destroyed",
								id: tf.id,
								position: tf.position,
							});
						}
					}

					await tx
						.delete(taskForceEngagements)
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:ended",
						id: engagement.id,
					});
				} else {
					await tx
						.update(taskForceEngagements)
						.set({
							phaseProgress,
						})
						.where(eq(taskForceEngagements.id, engagement.id));

					ctx.postMessage({
						type: "taskForceEngagement:phaseProgress",
						id: engagement.id,
						phaseProgress,
					});
				}

				break;
			}
		}
	}
}
