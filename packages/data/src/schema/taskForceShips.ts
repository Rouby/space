import { eq, relations, sql } from "drizzle-orm";
import {
	numeric,
	pgEnum,
	pgTable,
	pgView,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { shipDesigns } from "./shipDesigns.ts";
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

	hullState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	speedState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	shieldState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	armorState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	weaponState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	sensorState: numeric({ precision: 30, scale: 6 }).notNull().default("1"),
	supplyCarried: numeric({ precision: 30, scale: 6 }).notNull().default("0"),
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
				taskForceId: taskForceShips.taskForceId,
				name: taskForceShips.name,
				role: taskForceShips.role,
				hullState: taskForceShips.hullState,
				hullRating: shipDesigns.hullRating,
				hull: sql`${shipDesigns.hullRating} * ${taskForceShips.hullState}`
					.mapWith(shipDesigns.hullRating)
					.as("hull"),
				shieldState: taskForceShips.shieldState,
				shieldRating: shipDesigns.shieldRating,
				shield: sql`${shipDesigns.shieldRating} * ${taskForceShips.shieldState}`
					.mapWith(shipDesigns.shieldRating)
					.as("shield"),
				armorState: taskForceShips.armorState,
				armorRating: shipDesigns.armorRating,
				armor: sql`${shipDesigns.armorRating} * ${taskForceShips.armorState}`
					.mapWith(shipDesigns.armorRating)
					.as("armor"),
				weaponState: taskForceShips.weaponState,
				weaponRating: shipDesigns.weaponRating,
				weapon: sql`${shipDesigns.weaponRating} * ${taskForceShips.weaponState}`
					.mapWith(shipDesigns.weaponRating)
					.as("weapon"),
				supplyCarried: taskForceShips.supplyCarried,
				supplyCapacity: shipDesigns.supplyCapacity,
				zoneOfControlRating: shipDesigns.zoneOfControlRating,
				sensorState: taskForceShips.sensorState,
				sensorRating: shipDesigns.sensorRating,
				sensor:
					sql`${shipDesigns.sensorRating} * ${taskForceShips.sensorState} * 100`
						.mapWith(shipDesigns.sensorRating)
						.as("sensor"),
				id: taskForceShips.id,
				speedState: taskForceShips.speedState,
				speedRating: shipDesigns.speedRating,
				speed: sql`${shipDesigns.speedRating} * ${taskForceShips.speedState}`
					.mapWith(shipDesigns.speedRating)
					.as("speed"),
				movementSupplyNeed: sql`${shipDesigns.supplyNeed} * 0.01`
					.mapWith(shipDesigns.supplyNeed)
					.as("movementSupplyNeed"),
				combatSupplyNeed: sql`${shipDesigns.supplyNeed} * 0.05`
					.mapWith(shipDesigns.supplyNeed)
					.as("combatSupplyNeed"),
			})
			.from(taskForceShips)
			.innerJoin(shipDesigns, eq(taskForceShips.shipDesignId, shipDesigns.id)),
);
