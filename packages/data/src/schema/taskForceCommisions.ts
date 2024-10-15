import { relations, sql } from "drizzle-orm";
import {
	decimal,
	pgTable,
	primaryKey,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { resources } from "./resources.ts";
import { shipDesigns } from "./shipDesigns.ts";
import { starSystems } from "./starSystems.ts";
import { taskForceShipRole, taskForces } from "./taskForces.ts";

export const taskForceShipCommisions = pgTable("taskForceShipCommisions", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	starSystemId: uuid("starSystemId")
		.notNull()
		.references(() => starSystems.id, { onDelete: "cascade" }),
	shipDesignId: uuid("shipDesignId")
		.notNull()
		.references(() => shipDesigns.id, { onDelete: "cascade" }),
	taskForceId: uuid("taskForceId")
		.notNull()
		.references(() => taskForces.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 256 }).notNull(),
	role: taskForceShipRole("role").notNull(),
	progress: decimal("progress", { precision: 30, scale: 6 }).notNull(),
});

export const taskForceCommisionsRelations = relations(
	taskForceShipCommisions,
	({ one, many }) => ({
		starSystem: one(starSystems, {
			fields: [taskForceShipCommisions.starSystemId],
			references: [starSystems.id],
		}),
		shipDesign: one(shipDesigns, {
			fields: [taskForceShipCommisions.shipDesignId],
			references: [shipDesigns.id],
		}),
		resourceNeeds: many(taskForceShipCommisionResourceNeeds),
	}),
);

export const taskForceShipCommisionResourceNeeds = pgTable(
	"taskForceShipCommisionResourceNeeds",
	{
		taskForceShipCommisionId: uuid("taskForceShipCommisionId")
			.notNull()
			.references(() => taskForceShipCommisions.id, { onDelete: "cascade" }),
		resourceId: uuid("resourceId")
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		alotted: decimal("alotted", { precision: 30, scale: 6 }).notNull(),
		needed: decimal("needed", { precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.taskForceShipCommisionId, table.resourceId],
		}),
	}),
);
