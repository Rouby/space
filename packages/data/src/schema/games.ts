import { relations, sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const games = pgTable("games", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	startedAt: timestamp(),
	setupCompleted: boolean().notNull().default(false),
	version: integer().notNull().default(0),
	tickRate: integer().notNull().default(100),
});

export const players = pgTable(
	"players",
	{
		userId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		color: varchar({ length: 7 }).notNull().default("#000000"),
	},
	(table) => ({ pk: primaryKey({ columns: [table.userId, table.gameId] }) }),
);

export const gamesRelations = relations(games, ({ many }) => ({
	gamesToUsers: many(players),
}));

export const gamesToUsersRelations = relations(players, ({ one }) => ({
	game: one(games, {
		fields: [players.gameId],
		references: [games.id],
	}),
	user: one(users, {
		fields: [players.userId],
		references: [users.id],
	}),
}));
