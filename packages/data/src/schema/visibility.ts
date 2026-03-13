import { isNotNull, isNull, sql } from "drizzle-orm";
import { customType, pgView } from "drizzle-orm/pg-core";
import { starSystems } from "./starSystems.ts";
import { taskForces } from "./taskForces.ts";

const circle = customType<{ data: { x: number; y: number; radius: number } }>({
	dataType(_config) {
		return "circle";
	},
	toDriver(value) {
		return `<(${value.x},${value.y}),${value.radius}>`;
	},
	fromDriver(value) {
		if (typeof value === "string") {
			const [, x, y, radius] =
				value.match(/<\(([^,]+),([^,]+)\),([^>]+)>/) ?? [];
			return { x: +x, y: +y, radius: +radius };
		}
		return value as { x: number; y: number; radius: number };
	},
});

export const visibility = pgView("visibility").as((qb) =>
	qb
		.select({
			userId: sql<string>`${taskForces.ownerId}`.as("userId"),
			gameId: taskForces.gameId,
			circle: sql`circle(${taskForces.position}, COALESCE(${taskForces.sensorRange}, 0))`
				.mapWith(circle)
				.as("circle"),
		})
		.from(taskForces)
		.where(isNull(taskForces.deletedAt))
		.groupBy(taskForces.id, taskForces.ownerId, taskForces.gameId)
		.unionAll(
			qb
				.select({
					userId: sql<string>`${starSystems.ownerId}`.as("userId"),
					gameId: starSystems.gameId,
					circle: sql`circle(${starSystems.position}, 1000)`
						.mapWith(circle)
						.as("circle"),
				})
				.from(starSystems)
				.where(isNotNull(starSystems.ownerId)),
		),
);
