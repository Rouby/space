import { relations, sql } from "drizzle-orm";
import {
	json,
	numeric,
	pgEnum,
	pgTable,
	point,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { shipDesigns } from "./shipDesigns.ts";
import { taskForceEngagementsToTaskForces } from "./taskForceEngagements.ts";
import { users } from "./users.ts";

export const taskForceShipRole = pgEnum("taskForceShipRole", [
	"capital",
	"screen",
	"carrier",
	"scout",
	"support",
	"transport",
]);

export const taskForces = pgTable("taskForces", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid("ownerId")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar("name", { length: 256 }).notNull(),
	position: point("position", { mode: "xy" }).notNull(),
	orders: json("orders")
		.notNull()
		.$type<
			{ id: string; type: "move"; destination: { x: number; y: number } }[]
		>()
		.default([]),
	movementVector: point("movementVector", { mode: "xy" }),
});

export const taskForcesRelations = relations(taskForces, ({ one, many }) => ({
	owner: one(users, {
		fields: [taskForces.ownerId],
		references: [users.id],
	}),
	taskForceEngagmentsToTaskForces: many(taskForceEngagementsToTaskForces),
}));

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
	supplyCarried: numeric("supplyCarried", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
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
