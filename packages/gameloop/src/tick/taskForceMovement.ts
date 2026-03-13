import { and, eq, isNull, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

type MoveOrder = {
	id: string;
	type: "move";
	destination: { x: number; y: number };
};

const FTL_SPEED_MULTIPLIER = 100;

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

	return isFiniteCoordinate(from.x) && isFiniteCoordinate(from.y);
}

export async function tickTaskForceMovement(tx: Transaction, ctx: Context) {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			position: taskForces.position,
			constructionDone: taskForces.constructionDone,
			constructionTotal: taskForces.constructionTotal,
			orders: taskForces.orders,
			ftlSpeed: taskForces.ftlSpeed,
		})
		.from(taskForces)
		.where(and(eq(taskForces.gameId, gameId), isNull(taskForces.deletedAt)));

	for (const taskForce of allTaskForces) {
		const constructionDone = Number(taskForce.constructionDone ?? "0");
		const constructionTotal = Number(taskForce.constructionTotal ?? "0");
		if (constructionTotal > 0 && constructionDone < constructionTotal) {
			continue;
		}

		const ftlSpeed = Number(taskForce.ftlSpeed ?? "0");
		if (ftlSpeed <= 0) {
			continue;
		}
		const moveRange = ftlSpeed * FTL_SPEED_MULTIPLIER;

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
					and(
						eq(taskForces.id, taskForce.id),
						eq(taskForces.gameId, gameId),
						isNull(taskForces.deletedAt),
					),
				);
			continue;
		}

		const movementVector = {
			x: firstOrder.destination.x - taskForce.position.x,
			y: firstOrder.destination.y - taskForce.position.y,
		};
		const distance = Math.hypot(movementVector.x, movementVector.y);
		const isArrivingThisTick = distance <= moveRange;
		const moveScale = distance === 0 ? 0 : Math.min(1, moveRange / distance);
		const nextPosition = isArrivingThisTick
			? firstOrder.destination
			: {
					x: taskForce.position.x + movementVector.x * moveScale,
					y: taskForce.position.y + movementVector.y * moveScale,
				};
		const resolvedMovementVector = {
			x: nextPosition.x - taskForce.position.x,
			y: nextPosition.y - taskForce.position.y,
		};

		const [updated] = await tx
			.update(taskForces)
			.set({
				position: nextPosition,
				movementVector: resolvedMovementVector,
				orders: isArrivingThisTick ? remainingOrders : taskForce.orders,
			})
			.where(
				and(
					eq(taskForces.id, taskForce.id),
					eq(taskForces.gameId, gameId),
					isNull(taskForces.deletedAt),
				),
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
