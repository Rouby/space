import { sql } from "drizzle-orm";
import {
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const games = pgTable("games", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	startedAt: timestamp("startedAt"),
});

export const players = pgTable(
	"players",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		gameId: uuid("gameId")
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
	},
	(table) => ({ pk: primaryKey({ columns: [table.userId, table.gameId] }) }),
);
