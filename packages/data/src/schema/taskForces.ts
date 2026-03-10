import { relations, sql } from "drizzle-orm";
import {
	decimal,
	json,
	pgTable,
	point,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { starSystems } from "./starSystems.ts";
import { users } from "./users.ts";

export const taskForces = pgTable("taskForces", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
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
	combatDeck: json().notNull().$type<string[]>().default([]),
	movementVector: point({ mode: "xy" }),
	constructionStarSystemId: uuid().references(() => starSystems.id, {
		onDelete: "set null",
	}),
	constructionDone: decimal({ precision: 30, scale: 6 }),
	constructionTotal: decimal({ precision: 30, scale: 6 }),
	constructionPerTick: decimal({ precision: 30, scale: 6 }),
	deletedAt: timestamp(),
});

export const taskForcesRelations = relations(taskForces, ({ one }) => ({
	owner: one(users, {
		fields: [taskForces.ownerId],
		references: [users.id],
	}),
}));
