import { relations, sql } from "drizzle-orm";
import { pgTable, point, uuid, varchar } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { planets } from "./planets.ts";
import { users } from "./users.ts";

export const starSystems = pgTable("starSystems", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 256 }).notNull(),
	position: point("position", { mode: "xy" }).notNull(),
	ownerId: uuid("ownerId").references(() => users.id, { onDelete: "restrict" }),
});

export const starSystemsRelations = relations(starSystems, ({ one, many }) => ({
	game: one(games, { fields: [starSystems.gameId], references: [games.id] }),
	planets: many(planets),
	owner: one(users, { fields: [starSystems.ownerId], references: [users.id] }),
}));