import { relations, sql } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	point,
	primaryKey,
	real,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { taskForces } from "./taskForces.ts";

export const taskForceEngagementPhase = pgEnum("taskForceEngagementPhase", [
	"locating",
	"engagement",
	"resolution",
]);

export const taskForceEngagements = pgTable("taskForceEngagements", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	position: point({ mode: "xy" }).notNull(),
	startedAt: timestamp().notNull(),
	phase: taskForceEngagementPhase().notNull().default("locating"),
	phaseProgress: real().notNull().default(0),
});

export const taskForceEngagementsRelations = relations(
	taskForceEngagements,
	({ many }) => ({
		taskForceEngagmentsToTaskForces: many(taskForceEngagementsToTaskForces),
	}),
);

export const taskForceEngagementsToTaskForces = pgTable(
	"taskForceEngagementsToTaskForces",
	{
		taskForceEngagementId: uuid()
			.notNull()
			.references(() => taskForceEngagements.id, { onDelete: "cascade" }),
		taskForceId: uuid()
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.taskForceEngagementId, table.taskForceId],
		}),
	}),
);

export const taskForceEngagementsToTaskForcesRelations = relations(
	taskForceEngagementsToTaskForces,
	({ one }) => ({
		taskForceEngagement: one(taskForceEngagements, {
			fields: [taskForceEngagementsToTaskForces.taskForceEngagementId],
			references: [taskForceEngagements.id],
		}),
		taskForce: one(taskForces, {
			fields: [taskForceEngagementsToTaskForces.taskForceId],
			references: [taskForces.id],
		}),
	}),
);
