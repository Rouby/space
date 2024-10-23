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
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 256 }).notNull(),
	position: point("position", { mode: "xy" }).notNull(),
	ownerId: uuid("ownerId").references(() => users.id, { onDelete: "restrict" }),
	discoverySlots: integer("discoverySlots").notNull().default(0),
});

export const starSystemsRelations = relations(starSystems, ({ one, many }) => ({
	game: one(games, { fields: [starSystems.gameId], references: [games.id] }),
	owner: one(users, { fields: [starSystems.ownerId], references: [users.id] }),
	populations: many(starSystemPopulations),
}));

export const starSystemResourceDiscoveries = pgTable(
	"starSystemResourceDiscoveries",
	{
		starSystemId: uuid("starSystemId")
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid("resourceId")
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		discoveredAt: timestamp("discoveredAt").notNull(),
		remainingDeposits: decimal("remainingDeposits", {
			precision: 30,
			scale: 6,
		}).notNull(),
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
		starSystemId: uuid("starSystemId")
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid("resourceId")
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		quantity: decimal("quantity", { precision: 30, scale: 6 }).notNull(),
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
		starSystemId: uuid("starSystemId")
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		amount: bigint("amount", { mode: "bigint" }).notNull(),
		allegianceToPlayerId: uuid("allegianceToPlayerId").references(
			() => users.id,
			{ onDelete: "restrict" },
		),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.starSystemId, table.allegianceToPlayerId],
		}),
	}),
);
