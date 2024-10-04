import { relations, sql } from "drizzle-orm";
import { pgTable, real, uuid } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { starSystems } from "./starSystems.ts";

export const taskForceCommisions = pgTable("taskForceCommisions", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	starSystemId: uuid("starSystemId")
		.notNull()
		.references(() => starSystems.id, { onDelete: "cascade" }),
	progress: real("progress").notNull().default(0),
	total: real("total").notNull(),
});

export const taskForceCommisionsRelations = relations(
	taskForceCommisions,
	({ one }) => ({
		starSystem: one(starSystems, {
			fields: [taskForceCommisions.starSystemId],
			references: [starSystems.id],
		}),
	}),
);
