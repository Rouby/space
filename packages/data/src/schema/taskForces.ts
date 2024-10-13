import { relations, sql } from "drizzle-orm";
import { json, pgTable, point, real, uuid, varchar } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { shipDesigns } from "./shipDesigns.ts";
import { taskForceEngagementsToTaskForces } from "./taskForceEngagements.ts";
import { users } from "./users.ts";

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
	supply: real("supply").notNull().default(0),
});

export const taskForcesRelations = relations(taskForces, ({ one, many }) => ({
	owner: one(users, {
		fields: [taskForces.ownerId],
		references: [users.id],
	}),
	taskForceEngagmentsToTaskForces: many(taskForceEngagementsToTaskForces),
}));

export const shipsInTaskForces = pgTable("shipsInTaskForces", {
	taskForceId: uuid("taskForceId")
		.notNull()
		.references(() => taskForces.id, { onDelete: "cascade" }),
	shipId: uuid("shipId")
		.notNull()
		.references(() => taskForces.id, { onDelete: "restrict" }),
	integrity: real("integrity").notNull(),
});

export const shipsInTaskForcesRelations = relations(
	shipsInTaskForces,
	({ one }) => ({
		taskForce: one(taskForces, {
			fields: [shipsInTaskForces.taskForceId],
			references: [taskForces.id],
		}),
		design: one(shipDesigns, {
			fields: [shipsInTaskForces.shipId],
			references: [shipDesigns.id],
		}),
	}),
);
