import { and, eq, isNull, starSystems, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceMissions(tx: Transaction, _ctx: Context) {
	const allTF = await tx
		.select({
			id: taskForces.id,
			ownerId: taskForces.ownerId,
			position: taskForces.position,
			mission: taskForces.mission,
			sensorRange: taskForces.sensorRange,
			ftlSpeed: taskForces.ftlSpeed,
		})
		.from(taskForces)
		.where(and(eq(taskForces.gameId, gameId), isNull(taskForces.deletedAt)));

	const allSystems = await tx
		.select({
			id: starSystems.id,
			ownerId: starSystems.ownerId,
			position: starSystems.position,
		})
		.from(starSystems)
		.where(eq(starSystems.gameId, gameId));

	for (const tf of allTF) {
		if (tf.mission === "manual" || !tf.mission) continue;
		const sensorRange = Number(tf.sensorRange ?? "0");

		let newOrder = null;

		if (tf.mission === "patrol" || tf.mission === "intercept") {
			if (sensorRange <= 0) continue;
			// Find nearest enemy task force inside sensor range
			let nearestEnemy = null;
			let minSqDist = sensorRange * sensorRange;

			for (const other of allTF) {
				if (other.id === tf.id || other.ownerId === tf.ownerId) continue;
				const dx = other.position.x - tf.position.x;
				const dy = other.position.y - tf.position.y;
				const sqDist = dx * dx + dy * dy;
				if (sqDist <= minSqDist) {
					minSqDist = sqDist;
					nearestEnemy = other;
				}
			}

			if (nearestEnemy) {
				newOrder = {
					id: crypto.randomUUID(),
					type: "move" as const,
					destination: nearestEnemy.position,
				};
			}
		} else if (tf.mission === "scout") {
			if (sensorRange <= 0) continue;
			// Run away from nearest enemy in sensor range
			let nearestEnemy = null;
			let minSqDist = sensorRange * sensorRange;

			for (const other of allTF) {
				if (other.id === tf.id || other.ownerId === tf.ownerId) continue;
				const dx = other.position.x - tf.position.x;
				const dy = other.position.y - tf.position.y;
				const sqDist = dx * dx + dy * dy;
				if (sqDist <= minSqDist) {
					minSqDist = sqDist;
					nearestEnemy = other;
				}
			}

			if (nearestEnemy) {
				const dx = tf.position.x - nearestEnemy.position.x;
				const dy = tf.position.y - nearestEnemy.position.y;
				const dist = Math.hypot(dx, dy);
				if (dist > 0) {
					const runDist = Number(tf.ftlSpeed ?? "1") * 100;
					const nx = tf.position.x + (dx / dist) * runDist;
					const ny = tf.position.y + (dy / dist) * runDist;
					newOrder = {
						id: crypto.randomUUID(),
						type: "move" as const,
						destination: { x: nx, y: ny },
					};
				}
			}
		} else if (tf.mission === "siege") {
			// Find nearest enemy star system globally
			let nearestSystem = null;
			let minSqDist = Number.POSITIVE_INFINITY;

			for (const sys of allSystems) {
				if (sys.ownerId === tf.ownerId || !sys.ownerId) continue;
				const dx = sys.position.x - tf.position.x;
				const dy = sys.position.y - tf.position.y;
				const sqDist = dx * dx + dy * dy;
				if (sqDist < minSqDist) {
					minSqDist = sqDist;
					nearestSystem = sys;
				}
			}

			if (nearestSystem) {
				newOrder = {
					id: crypto.randomUUID(),
					type: "move" as const,
					destination: nearestSystem.position,
				};
			}
		}

		if (newOrder) {
			await tx
				.update(taskForces)
				.set({ orders: [newOrder] })
				.where(eq(taskForces.id, tf.id));
		}
	}
}
