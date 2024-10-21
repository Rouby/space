import {
	type InferModelFromColumns,
	aliasedTable,
	and,
	eq,
	not,
	notExists,
	or,
	sql,
	taskForceEngagements,
	taskForceEngagementsToTaskForces,
	taskForceShips,
	taskForceShipsWithStats,
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
		let supplyCostFactor = 0;

		taskForceEngagements.$inferSelect;

		const taskForcesWithShipsAndStats = await tx
			.select({
				id: taskForces.id,
				ownerId: taskForces.ownerId,
				position: taskForces.position,
				shipsWithStats: sql<
					(InferModelFromColumns<
						(typeof taskForceShipsWithStats)["_"]["selectedFields"]
					> | null)[]
				>`json_agg(${taskForceShipsWithStats}.*)`.as("shipsWithStats"),
			})
			.from(taskForceEngagementsToTaskForces)
			.where(
				eq(
					taskForceEngagementsToTaskForces.taskForceEngagementId,
					engagement.id,
				),
			)
			.innerJoin(
				taskForces,
				eq(taskForces.id, taskForceEngagementsToTaskForces.taskForceId),
			)
			.leftJoin(
				taskForceShipsWithStats,
				eq(taskForceShipsWithStats.taskForceId, taskForces.id),
			)
			.groupBy(taskForces.id);

		switch (engagement.phase) {
			case "locating": {
				const phaseProgress = engagement.phaseProgress + 0.1;
				supplyCostFactor = 0.1;

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
				supplyCostFactor = 1;

				if (
					taskForcesWithShipsAndStats.filter(
						(tf) => tf.shipsWithStats.length > 0,
					).length <= 1
				) {
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
					// every ship picks a random other ship in another random taskforce and deals damage to its hull
					// if the hull reaches 0, the ship is destroyed
					// if all ships in a taskforce are destroyed, the taskforce is destroyed
					// if all taskforces but one are destroyed, the remaining taskforce wins

					for (const { id, shipsWithStats } of taskForcesWithShipsAndStats) {
						const otherTaskForces = taskForcesWithShipsAndStats.filter(
							(tf) =>
								tf.id !== id &&
								tf.shipsWithStats.filter((d) => d !== null).length > 0,
						);
						const targetTaskForce =
							otherTaskForces[
								Math.floor(Math.random() * otherTaskForces.length)
							];

						for (const ship of shipsWithStats.filter((d) => d !== null)) {
							const targetShip =
								// biome-ignore lint/style/noNonNullAssertion: <explanation>
								targetTaskForce.shipsWithStats[
									Math.floor(
										Math.random() * targetTaskForce.shipsWithStats.length,
									)
								]!;

							const damage = Math.floor(Math.random() * +ship.weapon);

							targetShip.hullState = `${Math.max(0, +targetShip.hullState - damage)}`;
						}
					}

					for (const ship of taskForcesWithShipsAndStats.flatMap((tf) =>
						tf.shipsWithStats.filter((d) => d !== null),
					)) {
						if (+ship.hullState <= 0) {
							await tx
								.delete(taskForceShips)
								.where(eq(taskForceShips.id, ship.id));

							// ctx.postMessage({
							// 	type: "taskForceShip:destroyed",
							// 	id: ship.id,
							// 	position: ship.position,
							// });
						} else {
							await tx
								.update(taskForceShips)
								.set({
									hullState: ship.hullState,
								})
								.where(eq(taskForceShips.id, ship.id));
						}
					}
				}

				break;
			}

			case "resolution": {
				const phaseProgress = engagement.phaseProgress + 0.1;
				supplyCostFactor = 0;

				if (phaseProgress >= 1) {
					const winnerId = taskForcesWithShipsAndStats.find(
						(tf) => tf.shipsWithStats.length > 0,
					)?.ownerId;

					console.log("winnerId", winnerId);

					for (const tf of taskForcesWithShipsAndStats) {
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

		// reduce supply of all ships in TFs
		for (const ship of taskForcesWithShipsAndStats
			.flatMap((tf) => tf.shipsWithStats.filter((d) => d !== null))
			.filter((ship) => +ship.hullState > 0)) {
			const supplyCosts = supplyCostFactor * +ship.combatSupplyNeed;
			await tx
				.update(taskForceShips)
				.set({
					supplyCarried: `${Math.max(0, +ship.supplyCarried - supplyCosts)}`,
				})
				.where(eq(taskForceShips.id, ship.id));
		}
	}
}
