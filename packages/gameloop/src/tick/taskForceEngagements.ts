import {
	aliasedTable,
	and,
	eq,
	inArray,
	not,
	notExists,
	or,
	shipComponents,
	shipDesignComponents,
	sql,
	taskForceEngagements,
	taskForceEngagementsToTaskForces,
	taskForceShips,
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
		switch (engagement.phase) {
			case "locating": {
				const phaseProgress = engagement.phaseProgress + 0.1;

				if (phaseProgress >= 1) {
					console.log("located");

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
				const shipsWithComponents = await tx
					.select({
						id: taskForceShips.id,
						name: taskForceShips.name,
						taskForceId: taskForceShips.taskForceId,
						structuralIntegrity: taskForceShips.structuralIntegrity,
						components: sql<
							(typeof shipComponents.$inferSelect)[]
						>`json_agg(${shipComponents}.*)`.as("components"),
						componentPositions: sql<
							number[]
						>`json_agg(${shipDesignComponents.position})`.as(
							"componentPositions",
						),
						componentStates: taskForceShips.componentStates,
					})
					.from(taskForceShips)
					.innerJoin(
						shipDesignComponents,
						eq(shipDesignComponents.shipDesignId, taskForceShips.shipDesignId),
					)
					.innerJoin(
						shipComponents,
						eq(shipComponents.id, shipDesignComponents.shipComponentId),
					)
					.innerJoin(
						taskForceEngagementsToTaskForces,
						eq(
							taskForceShips.taskForceId,
							taskForceEngagementsToTaskForces.taskForceId,
						),
					)
					.where(
						eq(
							taskForceEngagementsToTaskForces.taskForceEngagementId,
							engagement.id,
						),
					)
					.groupBy(taskForceShips.id);

				const taskForcesWithShipsAndComponents = Object.entries(
					Object.groupBy(shipsWithComponents, (d) => d.taskForceId),
				).map(([id, ships]) => ({
					id,
					ships:
						ships?.map(
							({ components, componentPositions, componentStates, ...s }) => ({
								...s,
								components: components
									.map((c, idx) => ({
										...c,
										position: componentPositions[idx],
										state: componentStates[componentPositions[idx]],
									}))
									.filter((c) => +c.state > 0),
							}),
						) ?? [],
				}));

				console.log("------------------------------");

				if (
					taskForcesWithShipsAndComponents.filter(
						(tf) => tf.ships.filter(isIntactShip).length > 0,
					).length <= 1
				) {
					// no more than one task force with ships left
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

					for (const { id, ships } of taskForcesWithShipsAndComponents) {
						const otherTaskForces = taskForcesWithShipsAndComponents.filter(
							(tf) => tf.id !== id && tf.ships.filter(isIntactShip).length > 0,
						);
						const targetTaskForce =
							otherTaskForces[
								Math.floor(Math.random() * otherTaskForces.length)
							];

						for (const ship of ships) {
							const targetShip =
								targetTaskForce.ships[
									Math.floor(Math.random() * targetTaskForce.ships.length)
								];

							const weaponComponents = ship.components.filter(
								(d) => d.weaponDeliveryType !== null && d.weaponDamage !== null,
							);

							const defenseComponents = targetShip.components.filter(
								(c) => c.armorThickness !== null || c.shieldStrength !== null,
							);

							for (const weapon of weaponComponents) {
								console.log(
									`${ship.name} attacks ${targetShip.name} with ${weapon.name}`,
								);
								// weapon.weaponCooldown
								// weapon.weaponRange
								// weapon.weaponAccuracy
								const damageDealt = +(weapon.weaponDamage ?? "0");
								const damageAfterMitigation = defenseComponents.reduce(
									(damageLeft, defense) => {
										if (damageLeft === 0) {
											return 0;
										}

										let damageLeftAfterMitigation = damageLeft;

										if (defense.shieldStrength !== null) {
											const shieldEffectiveness =
												defense.shieldEffectivenessAgainst?.find(
													(e) => e.deliveryType === weapon.weaponDeliveryType,
												)?.effectiveness ?? 0;

											const effectiveShieldStrength =
												+defense.shieldStrength * shieldEffectiveness;

											const damageMitigation = Math.max(
												0,
												effectiveShieldStrength -
													+(weapon.weaponShieldPenetration ?? "0"),
											);

											const damageToState =
												Math.max(
													0,
													damageLeft,
													+defense.shieldStrength -
														+(weapon.weaponShieldPenetration ?? "0"),
												) / 10;

											damageLeftAfterMitigation = Math.max(
												0,
												damageLeft - damageMitigation,
											);

											console.log(
												`${targetShip.name} mitigates attack with ${defense.name} by ${damageMitigation}`,
											);

											defense.state = `${Math.max(
												0,
												+defense.state - damageToState,
											)}`;

											console.log(
												`${defense.name} has ${defense.state} state left`,
											);
										}

										if (defense.armorThickness !== null) {
											const armorEffectiveness =
												defense.armorEffectivenessAgainst?.find(
													(e) => e.deliveryType === weapon.weaponDeliveryType,
												)?.effectiveness ?? 0;

											const effectiveArmorThickness =
												+defense.armorThickness * armorEffectiveness;

											const damageMitigation = Math.max(
												0,
												effectiveArmorThickness -
													+(weapon.weaponArmorPenetration ?? "0"),
											);

											const damageToState =
												Math.max(
													0,
													damageLeft,
													+defense.armorThickness -
														+(weapon.weaponShieldPenetration ?? "0"),
												) / 10;

											damageLeftAfterMitigation = Math.max(
												0,
												damageLeft - damageMitigation,
											);

											console.log(
												`${targetShip.name} mitigates attack with ${defense.name} by ${damageMitigation}`,
											);

											defense.state = `${Math.max(
												0,
												+defense.state - damageToState,
											)}`;

											console.log(
												`${defense.name} has ${defense.state} state left`,
											);
										}

										return damageLeftAfterMitigation;
									},
									damageDealt,
								);

								targetShip.structuralIntegrity = `${Math.max(0, +targetShip.structuralIntegrity - damageAfterMitigation / 10)}`;

								console.log(
									`${targetShip.name} took ${damageAfterMitigation} excess damage, at ${targetShip.structuralIntegrity} structural integrity`,
								);
							}
						}
					}

					for (const ship of taskForcesWithShipsAndComponents.flatMap(
						(tf) => tf.ships,
					)) {
						await tx
							.update(taskForceShips)
							.set({
								structuralIntegrity: ship.structuralIntegrity,
								componentStates: ship.components
									.sort((a, b) => a.position - b.position)
									.map((c) => c.state),
							})
							.where(eq(taskForceShips.id, ship.id));
					}
				}

				break;
			}

			case "resolution": {
				const phaseProgress = engagement.phaseProgress + 0.1;

				if (phaseProgress >= 1) {
					const ships = await tx
						.select({
							id: taskForceShips.id,
							name: taskForceShips.name,
							taskForceId: taskForceShips.taskForceId,
							structuralIntegrity: taskForceShips.structuralIntegrity,
						})
						.from(taskForceShips)
						.innerJoin(
							taskForceEngagementsToTaskForces,
							eq(
								taskForceShips.taskForceId,
								taskForceEngagementsToTaskForces.taskForceId,
							),
						)
						.where(
							eq(
								taskForceEngagementsToTaskForces.taskForceEngagementId,
								engagement.id,
							),
						)
						.groupBy(taskForceShips.id);

					const taskForcesWithShips = Object.entries(
						Object.groupBy(ships, (d) => d.taskForceId),
					).map(([id, ships]) => ({
						id,
						ships: ships ?? [],
					}));

					const winningTaskForce = taskForcesWithShips.find(
						(tf) => tf.ships.filter(isIntactShip).length > 0,
					);

					if (!winningTaskForce) {
						console.log("Noone won");
					} else {
						console.log(`Task force ${winningTaskForce.id} won!`);
					}

					await tx.delete(taskForces).where(
						inArray(
							taskForces.id,
							taskForcesWithShips
								.filter((tf) => tf.id !== winningTaskForce?.id)
								.map((tf) => tf.id),
						),
					);

					for (const tf of taskForcesWithShips) {
						ctx.postMessage({
							type: "taskForceEngagement:taskForceLeft",
							id: engagement.id,
							taskForceId: tf.id,
						});
					}

					for (const tf of taskForcesWithShips.filter(
						(tf) => tf.id !== winningTaskForce?.id,
					)) {
						ctx.postMessage({
							type: "taskForce:destroyed",
							id: tf.id,
						});
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
		// for (const ship of taskForcesWithShipsAndStats
		// 	.flatMap((tf) => tf.ships.filter((d) => d !== null))
		// 	.filter((ship) => +ship.hullState > 0)) {
		// 	const supplyCosts = supplyCostFactor * +ship.supplyNeedCombat;

		// 	await tx
		// 		.update(taskForceShips)
		// 		.set({
		// 			supplyCarried: `${Math.max(0, +ship.supplyCarried - supplyCosts)}`,
		// 		})
		// 		.where(eq(taskForceShips.id, ship.id));
		// }
	}
}

function isIntactShip(ship: { structuralIntegrity: string }) {
	return +ship.structuralIntegrity > 0;
}
