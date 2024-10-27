import { relations, sql } from "drizzle-orm";
import { json, pgTable, point, uuid, varchar } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { taskForceEngagementsToTaskForces } from "./taskForceEngagements.ts";
import { users } from "./users.ts";

export const taskForces = pgTable("taskForces", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar({ length: 256 }).notNull(),
	position: point({ mode: "xy" }).notNull(),
	orders: json()
		.notNull()
		.$type<
			(
				| { id: string; type: "move"; destination: { x: number; y: number } }
				| { id: string; type: "follow"; taskForceId: string }
				| { id: string; type: "colonize" }
			)[]
		>()
		.default([]),
	movementVector: point({ mode: "xy" }),
});

export const taskForcesRelations = relations(taskForces, ({ one, many }) => ({
	owner: one(users, {
		fields: [taskForces.ownerId],
		references: [users.id],
	}),
	taskForceEngagmentsToTaskForces: many(taskForceEngagementsToTaskForces),
}));
