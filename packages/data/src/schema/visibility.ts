import { sql } from "drizzle-orm";
import { customType, pgView, uuid } from "drizzle-orm/pg-core";

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

export const visibility = pgView("visibility", {
	userId: uuid("userId").notNull(),
	gameId: uuid("gameId").notNull(),
	circle: circle("circle").notNull(),
}).as(sql`
CREATE VIEW "visibility" AS
SELECT
    tf."ownerId" as "userId",
    tf."gameId" as "gameId",
    circle(tf.position, 100) as "circle"
FROM "taskForces" tf
UNION ALL
SELECT
    ss."ownerId" as "userId",
    ss."gameId" as "gameId",
    circle(ss.position, 1000) as "circle"
FROM "starSystems" ss
WHERE
    "ownerId" IS NOT NULL;`);
