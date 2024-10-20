import {
	and,
	eq,
	notExists,
	sql,
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

		while (orders?.at(0)?.type === "move" && movement > 0) {
			const [order] = orders;

			movementVector = {
				x: order.destination.x - position.x,
				y: order.destination.y - position.y,
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
				position = { ...order.destination };

				orders = orders.slice(1);
				movement -= distance;
				movementVector = null;
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
	}
}
