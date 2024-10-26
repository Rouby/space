import {
	and,
	eq,
	notExists,
	sql,
	starSystemPopulations,
	starSystems,
	taskForceEngagementsToTaskForces,
	taskForceShips,
	taskForceShipsWithStats,
	taskForces,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceMovements(tx: Transaction, ctx: Context) {
	const tfs = await tx
		.select({
			id: taskForces.id,
			ownerId: taskForces.ownerId,
			position: taskForces.position,
			orders: taskForces.orders,
			maxSpeed: sql<string>`min(${taskForceShipsWithStats.speed})`,
		})
		.from(taskForces)
		.innerJoin(
			taskForceShipsWithStats,
			eq(taskForces.id, taskForceShipsWithStats.taskForceId),
		)
		.where(
			and(
				eq(taskForces.gameId, gameId),
				// and not currently engaged in combat
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
		.groupBy(taskForces.id);

	for (const taskForce of tfs) {
		let { position, orders } = taskForce;
		const movementPerTick = +taskForce.maxSpeed;
		let movement = movementPerTick;
		let movementVector = null as { x: number; y: number } | null;

		while (orders?.at(0) && movement > 0) {
			const [order] = orders;

			let destination: { x: number; y: number } | null = null;
			let fullfillable = true;
			switch (order.type) {
				case "move": {
					destination = order.destination;
					break;
				}
				case "follow": {
					fullfillable = false;

					const [followedTaskForce] = await tx
						.select()
						.from(taskForces)
						.where(eq(taskForces.id, order.taskForceId));

					if (!followedTaskForce) {
						orders = orders.slice(1);
						continue;
					}

					// TODO: predict position?
					destination = followedTaskForce.position;
					break;
				}
			}

			if (!destination) {
				break;
			}

			movementVector = {
				x: destination.x - position.x,
				y: destination.y - position.y,
			};
			const distance = Math.sqrt(
				movementVector.x * movementVector.x +
					movementVector.y * movementVector.y,
			);
			movementVector = {
				x: movementVector.x / distance,
				y: movementVector.y / distance,
			};

			if (distance <= movement) {
				position = { ...destination };

				movement -= distance;
				if (fullfillable) {
					orders = orders.slice(1);
					movementVector = null;
				} else {
					movement = 0;
					movementVector = {
						x: movementVector.x * distance,
						y: movementVector.y * distance,
					};
				}
			} else {
				position = {
					x: position.x + movementVector.x * movement,
					y: position.y + movementVector.y * movement,
				};

				movement = 0;
				movementVector = {
					x: movementVector.x * movementPerTick,
					y: movementVector.y * movementPerTick,
				};
			}
		}

		if (position !== taskForce.position) {
			const movementDone = movementPerTick - movement;

			const shipsWithStats = await tx
				.select()
				.from(taskForceShipsWithStats)
				.where(eq(taskForceShipsWithStats.taskForceId, taskForce.id));

			for (const ship of shipsWithStats) {
				const movementPercent = movementDone / +ship.speed;
				const supplyCosts = movementPercent * +ship.movementSupplyNeed;
				await tx
					.update(taskForceShips)
					.set({
						supplyCarried: `${Math.max(0, +ship.supplyCarried - supplyCosts)}`,
					})
					.where(eq(taskForceShips.id, ship.id));
			}

			await tx
				.update(taskForces)
				.set({ position, orders, movementVector })
				.where(eq(taskForces.id, taskForce.id));

			ctx.postMessage({
				type: "taskForce:position",
				id: taskForce.id,
				position,
				movementVector,
			});
		}

		if (orders.at(0)?.type === "colonize") {
			const [starSystemAtPosition] = await tx
				.select()
				.from(starSystems)
				.where(
					sql`${starSystems.position} <-> point(${position.x},${position.y}) < 0.1`,
				);

			orders = orders.slice(1);

			if (!starSystemAtPosition) {
				// ignore, order will be cancel'd
				console.log("Invalid colonize order");
			} else {
				await tx
					.update(starSystems)
					.set({ ownerId: taskForce.ownerId })
					.where(eq(starSystems.id, starSystemAtPosition.id));
				await tx.insert(starSystemPopulations).values({
					starSystemId: starSystemAtPosition.id,
					allegianceToPlayerId: taskForce.ownerId,
					amount: 10_000n,
				});

				ctx.postMessage({
					type: "starSystem:ownerChanged",
					id: starSystemAtPosition.id,
					ownerId: taskForce.ownerId,
				});
			}

			await tx
				.update(taskForces)
				.set({ orders })
				.where(eq(taskForces.id, taskForce.id));
		}
	}
}
