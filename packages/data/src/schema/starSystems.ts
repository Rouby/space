import { relations, sql } from "drizzle-orm";
import {
	bigint,
	decimal,
	integer,
	pgTable,
	point,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";

import { resources } from "./resources.ts";
import { users } from "./users.ts";

export const starSystems = pgTable("starSystems", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar({ length: 256 }).notNull(),
	position: point({ mode: "xy" }).notNull(),
	ownerId: uuid().references(() => users.id, { onDelete: "restrict" }),
	discoverySlots: integer().notNull().default(0),
	discoveryProgress: decimal({ precision: 10, scale: 9 })
		.notNull()
		.default("0"),
});

export const starSystemsRelations = relations(starSystems, ({ one, many }) => ({
	game: one(games, { fields: [starSystems.gameId], references: [games.id] }),
	owner: one(users, { fields: [starSystems.ownerId], references: [users.id] }),
	populations: many(starSystemPopulations),
}));

export const starSystemResourceDiscoveries = pgTable(
	"starSystemResourceDiscoveries",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		discoveredAt: timestamp().notNull(),
		remainingDeposits: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.starSystemId, table.resourceId],
		}),
	}),
);

export const starSystemResourceDepots = pgTable(
	"starSystemResourceDepots",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		quantity: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.starSystemId, table.resourceId],
		}),
	}),
);

export const starSystemPopulations = pgTable(
	"starSystemPopulations",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		amount: bigint({ mode: "bigint" }).notNull(),
		growthLeftover: decimal({ precision: 10, scale: 9 }).notNull().default("0"),
		allegianceToPlayerId: uuid().references(() => users.id, {
			onDelete: "restrict",
		}),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.starSystemId, table.allegianceToPlayerId],
		}),
	}),
);
