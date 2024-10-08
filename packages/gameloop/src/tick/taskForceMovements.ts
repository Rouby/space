import { eq, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceMovements(tx: Transaction, ctx: Context) {
	const tfs = await tx.query.taskForces.findMany({
		where: eq(taskForces.gameId, gameId),
	});

	for (const taskForce of tfs) {
		let { position, orders } = taskForce;
		const movementPerTick = 4;
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
			await tx
				.update(taskForces)
				.set({ position, orders, movementVector })
				.where(eq(taskForces.id, taskForce.id));

			ctx.postMessage({
				type: "taskForce:position",
				id: taskForce.id,
				position,
			});
		}
	}
}
