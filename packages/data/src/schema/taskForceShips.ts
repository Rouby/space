import { relations, sql } from "drizzle-orm";
import {
	decimal,
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
	"carrier",
	"scout",
	"support",
	"transport",
]);

export const taskForceShips = pgTable("taskForceShips", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	taskForceId: uuid("taskForceId")
		.notNull()
		.references(() => taskForces.id, { onDelete: "cascade" }),
	shipDesignId: uuid("shipDesignId")
		.notNull()
		.references(() => shipDesigns.id, { onDelete: "restrict" }),
	name: varchar("name", { length: 256 }).notNull(),
	role: taskForceShipRole("role").notNull(),

	hullState: numeric("hullState", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	shieldState: numeric("shieldState", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	armorState: numeric("armorState", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	weaponState: numeric("weaponState", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	sensorState: numeric("sensorState", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	supplyCarried: numeric("supplyCarried", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("0"),
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

export const taskForceShipsWithStats = pgView("taskForceShipsWithStats", {
	id: uuid("id").notNull(),
	taskForceId: uuid("taskForceId").notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	role: taskForceShipRole("role").notNull(),
	hullState: decimal("hullState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	hullRating: decimal("hullRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	hull: decimal("hull", {
		precision: 30,
		scale: 6,
	}).notNull(),
	speedState: decimal("speedState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	speedRating: decimal("speedRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	speed: decimal("speed", {
		precision: 30,
		scale: 6,
	}).notNull(),
	shieldState: decimal("shieldState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	shieldRating: decimal("shieldRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	shield: decimal("shield", {
		precision: 30,
		scale: 6,
	}).notNull(),
	armorState: decimal("armorState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	armorRating: decimal("armorRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	armor: decimal("armor", {
		precision: 30,
		scale: 6,
	}).notNull(),
	weaponState: decimal("weaponState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	weaponRating: decimal("weaponRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	weapon: decimal("weapon", {
		precision: 30,
		scale: 6,
	}).notNull(),
	supplyCarried: decimal("supplyCarried", {
		precision: 30,
		scale: 6,
	}).notNull(),
	supplyCapacity: decimal("supplyCapacity", {
		precision: 30,
		scale: 6,
	}).notNull(),
	movementSupplyNeed: decimal("movementSupplyNeed", {
		precision: 30,
		scale: 6,
	}).notNull(),
	combatSupplyNeed: decimal("combatSupplyNeed", {
		precision: 30,
		scale: 6,
	}).notNull(),
	zoneOfControlRating: decimal("zoneOfControlRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	sensorState: decimal("sensorState", {
		precision: 30,
		scale: 6,
	}).notNull(),
	sensorRating: decimal("sensorRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	sensor: decimal("sensor", {
		precision: 30,
		scale: 6,
	}).notNull(),
}).as(sql`
CREATE VIEW "taskForceShipsWithStats" AS (
    SELECT
        tfs."taskForceId" as "taskForceId",
        tfs."name" as "name",
        tfs."role" as "role",
        tfs."hullState" as "hullState",
        sd."hullRating" as "hullRating",
        (
            sd."hullRating" * tfs."hullState"
        ) as "hull",
        tfs."shieldState" as "shieldState",
        sd."shieldRating" as "shieldRating",
        (
            sd."shieldRating" * tfs."shieldState"
        ) as "shield",
        tfs."armorState" as "armorState",
        sd."armorRating" as "armorRating",
        (
            sd."armorRating" * tfs."armorState"
        ) as "armor",
        tfs."weaponState" as "weaponState",
        sd."weaponRating" as "weaponRating",
        (
            sd."weaponRating" * tfs."weaponState"
        ) as "weapon",
        tfs."supplyCarried" as "supplyCarried",
        sd."supplyCapacity" as "supplyCapacity",
        sd."zoneOfControlRating" as "zoneOfControlRating",
        tfs."sensorState" as "sensorState",
        sd."sensorRating" as "sensorRating",
        (
            sd."sensorRating" * tfs."sensorState" * 100
        ) as "sensor"
    FROM
        "taskForceShips" tfs
        JOIN "shipDesigns" sd ON tfs."shipDesignId" = sd."id"
);`);
