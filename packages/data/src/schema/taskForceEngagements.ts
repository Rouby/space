import { relations, sql } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	point,
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
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	position: point("position", { mode: "xy" }).notNull(),
	startedAt: timestamp("startedAt").notNull(),
	phase: taskForceEngagementPhase("phase").notNull().default("locating"),
	phaseProgress: real("phaseProgress").notNull().default(0),
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
		taskForceEngagementId: uuid("taskForceEngagementId")
			.notNull()
			.references(() => taskForceEngagements.id, { onDelete: "cascade" }),
		taskForceId: uuid("taskForceId")
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
	},
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
