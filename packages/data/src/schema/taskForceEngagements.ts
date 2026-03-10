import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	point,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { taskForces } from "./taskForces.ts";
import { users } from "./users.ts";

export const taskForceEngagements = pgTable(
	"taskForceEngagements",
	{
		id: varchar({ length: 256 }).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		taskForceIdA: uuid()
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
		taskForceIdB: uuid()
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
		ownerIdA: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		ownerIdB: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		position: point({ mode: "xy" }).notNull(),
		startedAtTurn: integer().notNull(),
		resolvedAtTurn: integer(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		index().on(table.gameId, table.resolvedAtTurn),
		index().on(table.gameId, table.ownerIdA, table.resolvedAtTurn),
		index().on(table.gameId, table.ownerIdB, table.resolvedAtTurn),
	],
);

export const taskForceEngagementsRelations = relations(
	taskForceEngagements,
	({ one }) => ({
		game: one(games, {
			fields: [taskForceEngagements.gameId],
			references: [games.id],
		}),
		taskForceA: one(taskForces, {
			fields: [taskForceEngagements.taskForceIdA],
			references: [taskForces.id],
		}),
		taskForceB: one(taskForces, {
			fields: [taskForceEngagements.taskForceIdB],
			references: [taskForces.id],
		}),
		ownerA: one(users, {
			fields: [taskForceEngagements.ownerIdA],
			references: [users.id],
		}),
		ownerB: one(users, {
			fields: [taskForceEngagements.ownerIdB],
			references: [users.id],
		}),
	}),
);
