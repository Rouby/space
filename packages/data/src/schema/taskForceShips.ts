import { eq, relations, sql } from "drizzle-orm";
import {
	decimal,
	pgEnum,
	pgTable,
	pgView,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { shipDesigns, shipDesignsWithStats } from "./shipDesigns.ts";
import { taskForces } from "./taskForces.ts";

export const taskForceShipRole = pgEnum("taskForceShipRole", [
	"capital",
	"screen",
	"support",
]);

export const taskForceShips = pgTable("taskForceShips", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	taskForceId: uuid()
		.notNull()
		.references(() => taskForces.id, { onDelete: "cascade" }),
	shipDesignId: uuid()
		.notNull()
		.references(() => shipDesigns.id, { onDelete: "restrict" }),
	name: varchar({ length: 256 }).notNull(),
	role: taskForceShipRole().notNull(),
	supplyCarried: decimal({ precision: 30, scale: 6 }).notNull().default("0"),
});

export const taskForceShipRelations = relations(taskForceShips, ({ one }) => ({
	taskForce: one(taskForces, {
		fields: [taskForceShips.taskForceId],
		references: [taskForces.id],
	}),
	shipDesign: one(shipDesigns, {
		fields: [taskForceShips.shipDesignId],
		references: [shipDesigns.id],
	}),
}));

export const taskForceShipsWithStats = pgView("taskForceShipsWithStats").as(
	(qb) =>
		qb
			.select({
				id: taskForceShips.id,
				taskForceId: taskForceShips.taskForceId,
				name: taskForceShips.name,
				role: taskForceShips.role,
				supplyCarried: taskForceShips.supplyCarried,

				// general stats
				supplyNeed: shipDesignsWithStats.supplyNeed,
				powerNeed: shipDesignsWithStats.powerNeed,
				crewNeed: shipDesignsWithStats.crewNeed,

				supplyCapacity: shipDesignsWithStats.supplyCapacity,
				powerGeneration: shipDesignsWithStats.powerGeneration,
				crewCapacity: shipDesignsWithStats.crewCapacity,

				// strategic stats
				ftlSpeed: shipDesignsWithStats.ftlSpeed,
				zoneOfControl: shipDesignsWithStats.zoneOfControl,
				sensorRange: shipDesignsWithStats.sensorRange,
			})
			.from(taskForceShips)
			.innerJoin(
				shipDesignsWithStats,
				eq(taskForceShips.shipDesignId, shipDesignsWithStats.id),
			),
);
