import { relations, sql } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { starSystems } from "./starSystems.ts";

export const planets = pgTable("planets", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	starSystemId: uuid("starSystemId")
		.notNull()
		.references(() => starSystems.id, { onDelete: "cascade" }),
});

export const planetsRelations = relations(planets, ({ one }) => ({
	starSystem: one(starSystems, {
		fields: [planets.starSystemId],
		references: [starSystems.id],
	}),
}));
