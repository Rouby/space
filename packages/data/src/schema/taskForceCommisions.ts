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
import { taskForceShipRole } from "./taskForceShips.ts";
import { taskForces } from "./taskForces.ts";

export const taskForceShipCommisions = pgTable("taskForceShipCommisions", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	starSystemId: uuid()
		.notNull()
		.references(() => starSystems.id, { onDelete: "cascade" }),
	shipDesignId: uuid()
		.notNull()
		.references(() => shipDesigns.id, { onDelete: "cascade" }),
	taskForceId: uuid()
		.notNull()
		.references(() => taskForces.id, { onDelete: "cascade" }),
	name: varchar({ length: 256 }).notNull(),
	role: taskForceShipRole().notNull(),
	progress: decimal({ precision: 30, scale: 6 }).notNull(),
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
		taskForceShipCommisionId: uuid()
			.notNull()
			.references(() => taskForceShipCommisions.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "cascade" }),
		alotted: decimal({ precision: 30, scale: 6 }).notNull(),
		needed: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.taskForceShipCommisionId, table.resourceId],
		}),
	}),
);
