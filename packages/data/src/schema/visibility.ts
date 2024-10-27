import { eq, isNotNull, sql } from "drizzle-orm";
import { customType, pgView } from "drizzle-orm/pg-core";
import { starSystems } from "./starSystems.ts";
import { taskForceShipsWithStats } from "./taskForceShips.ts";
import { taskForces } from "./taskForces.ts";

const circle = customType<{ data: { x: number; y: number; radius: number } }>({
	dataType(config) {
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
			userId: taskForces.ownerId,
			gameId: taskForces.gameId,
			circle:
				sql`circle(${taskForces.position}, max(${taskForceShipsWithStats.sensor}))`
					.mapWith(circle)
					.as("circle"),
		})
		.from(taskForces)
		.innerJoin(
			taskForceShipsWithStats,
			eq(taskForces.id, taskForceShipsWithStats.taskForceId),
		)
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
