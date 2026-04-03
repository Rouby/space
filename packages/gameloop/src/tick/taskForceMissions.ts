import {
	and,
	eq,
	isNull,
	lastKnownStates,
	starSystems,
	taskForces,
} from "@space/data/schema";
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
			orders: taskForces.orders,
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

	const allLastKnown = await tx
		.select({
			userId: lastKnownStates.userId,
			subjectId: lastKnownStates.subjectId,
		})
		.from(lastKnownStates)
		.where(eq(lastKnownStates.gameId, gameId));

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
			} else if (!tf.orders || tf.orders.length === 0) {
				const mySeenIds = new Set(
					allLastKnown
						.filter((lk) => lk.userId === tf.ownerId)
						.map((lk) => lk.subjectId),
				);
				const myTfs = allTF.filter((t) => t.ownerId === tf.ownerId);
				const mySystems = allSystems.filter((s) => s.ownerId === tf.ownerId);

				let nearestUnscouted = null;
				let minSqDistUnscouted = Number.POSITIVE_INFINITY;

				for (const sys of allSystems) {
					if (sys.ownerId === tf.ownerId) continue;
					if (mySeenIds.has(sys.id)) continue;

					let currentlyVisible = false;
					for (const mtf of myTfs) {
						const mtfRange = Number(mtf.sensorRange ?? "0");
						if (mtfRange <= 0) continue;
						const dist = Math.hypot(
							sys.position.x - mtf.position.x,
							sys.position.y - mtf.position.y,
						);
						if (dist <= mtfRange) {
							currentlyVisible = true;
							break;
						}
					}
					if (!currentlyVisible) {
						for (const msys of mySystems) {
							const dist = Math.hypot(
								sys.position.x - msys.position.x,
								sys.position.y - msys.position.y,
							);
							if (dist <= 1000) {
								currentlyVisible = true;
								break;
							}
						}
					}

					if (!currentlyVisible) {
						const dx = sys.position.x - tf.position.x;
						const dy = sys.position.y - tf.position.y;
						const sqDist = dx * dx + dy * dy;
						if (sqDist < minSqDistUnscouted) {
							minSqDistUnscouted = sqDist;
							nearestUnscouted = sys;
						}
					}
				}

				if (nearestUnscouted) {
					newOrder = {
						id: crypto.randomUUID(),
						type: "move" as const,
						destination: nearestUnscouted.position,
					};
				} else {
					let anyNearest = null;
					let anyMinSqDist = Number.POSITIVE_INFINITY;
					for (const sys of allSystems) {
						if (sys.ownerId === tf.ownerId) continue;
						const dx = sys.position.x - tf.position.x;
						const dy = sys.position.y - tf.position.y;
						const sqDist = dx * dx + dy * dy;
						if (sqDist < anyMinSqDist) {
							anyMinSqDist = sqDist;
							anyNearest = sys;
						}
					}
					if (anyNearest && anyMinSqDist > 100) {
						newOrder = {
							id: crypto.randomUUID(),
							type: "move" as const,
							destination: anyNearest.position,
						};
					}
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
