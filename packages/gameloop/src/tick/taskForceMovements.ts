import { eq, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceMovements(tx: Transaction, ctx: Context) {
	const tfs = await tx.query.taskForces.findMany({
		where: eq(taskForces.gameId, gameId),
	});

	for (const taskForce of tfs) {
		let { position, orders } = taskForce;
		let movement = 4;

		while (orders?.at(0)?.type === "move" && movement > 0) {
			const [order] = orders;

			const { x, y } = position;
			const { x: dx, y: dy } = order.destination;
			const [vx, vy] = [dx - x, dy - y];
			const distance = Math.sqrt(vx * vx + vy * vy);

			if (distance <= movement) {
				position = { ...order.destination };

				orders = orders.slice(1);
				movement -= distance;
			} else {
				const ratio = movement / distance;
				position = { x: x + vx * ratio, y: y + vy * ratio };

				movement = 0;
			}
		}

		if (position !== taskForce.position) {
			await tx
				.update(taskForces)
				.set({ position, orders })
				.where(eq(taskForces.id, taskForce.id));

			ctx.postMessage("taskForceMovement", {
				id: taskForce.id,
				position,
			});
		}
	}
}
