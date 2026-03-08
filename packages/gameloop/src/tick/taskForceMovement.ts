import { and, eq, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

type MoveOrder = {
	id: string;
	type: "move";
	destination: { x: number; y: number };
};

const MOVE_RANGE = 1_000;

function isMoveOrder(order: unknown): order is MoveOrder {
	if (!order || typeof order !== "object") {
		return false;
	}
	const candidate = order as Partial<MoveOrder>;
	return (
		candidate.type === "move" &&
		!!candidate.destination &&
		typeof candidate.destination.x === "number" &&
		typeof candidate.destination.y === "number"
	);
}

function isFiniteCoordinate(value: number) {
	return Number.isFinite(value);
}

function isLegalMove({
	from,
	to,
}: {
	from: { x: number; y: number };
	to: { x: number; y: number };
}) {
	if (!isFiniteCoordinate(to.x) || !isFiniteCoordinate(to.y)) {
		return false;
	}

	const distance = Math.hypot(to.x - from.x, to.y - from.y);
	return distance <= MOVE_RANGE;
}

export async function tickTaskForceMovement(tx: Transaction, ctx: Context) {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			position: taskForces.position,
			constructionDone: taskForces.constructionDone,
			constructionTotal: taskForces.constructionTotal,
			orders: taskForces.orders,
		})
		.from(taskForces)
		.where(eq(taskForces.gameId, gameId));

	for (const taskForce of allTaskForces) {
		const constructionDone = Number(taskForce.constructionDone ?? "0");
		const constructionTotal = Number(taskForce.constructionTotal ?? "0");
		if (constructionTotal > 0 && constructionDone < constructionTotal) {
			continue;
		}

		const [firstOrder, ...remainingOrders] = taskForce.orders;
		if (!isMoveOrder(firstOrder)) {
			continue;
		}

		if (
			!isLegalMove({
				from: taskForce.position,
				to: firstOrder.destination,
			})
		) {
			// Drop stale/invalid front-order to keep resolution deterministic.
			await tx
				.update(taskForces)
				.set({ orders: remainingOrders })
				.where(
					and(eq(taskForces.id, taskForce.id), eq(taskForces.gameId, gameId)),
				);
			continue;
		}

		const movementVector = {
			x: firstOrder.destination.x - taskForce.position.x,
			y: firstOrder.destination.y - taskForce.position.y,
		};

		const [updated] = await tx
			.update(taskForces)
			.set({
				position: firstOrder.destination,
				movementVector,
				orders: remainingOrders,
			})
			.where(
				and(eq(taskForces.id, taskForce.id), eq(taskForces.gameId, gameId)),
			)
			.returning({
				id: taskForces.id,
				position: taskForces.position,
				movementVector: taskForces.movementVector,
			});

		if (updated) {
			ctx.postMessage({
				type: "taskForce:position",
				id: updated.id,
				position: updated.position,
				movementVector: updated.movementVector,
			});
		}
	}
}
