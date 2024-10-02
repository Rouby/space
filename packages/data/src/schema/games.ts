import { sql } from "drizzle-orm";
import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const games = pgTable("games", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
});

export const players = pgTable(
	"players",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => users.id),
		gameId: uuid("gameId")
			.notNull()
			.references(() => games.id),
	},
	(table) => ({ pk: primaryKey({ columns: [table.userId, table.gameId] }) }),
);
