import { relations, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	decimal,
	pgTable,
	primaryKey,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { resources } from "./resources.ts";
import { users } from "./users.ts";

export const shipDesigns = pgTable("shipDesigns", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar({ length: 256 }).notNull(),
	description: text().notNull(),
	decommissioned: boolean().notNull().default(false),
	previousDesignId: uuid().references((): AnyPgColumn => shipDesigns.id, {
		onDelete: "restrict",
	}),
	hullRating: decimal({ precision: 30, scale: 6 }).notNull(),
	speedRating: decimal({ precision: 30, scale: 6 }).notNull(),
	armorRating: decimal({ precision: 30, scale: 6 }).notNull(),
	shieldRating: decimal({ precision: 30, scale: 6 }).notNull(),
	weaponRating: decimal({ precision: 30, scale: 6 }).notNull(),
	zoneOfControlRating: decimal({ precision: 30, scale: 6 }).notNull(),
	sensorRating: decimal({ precision: 30, scale: 6 }).notNull().default("1"),
	supplyNeed: decimal({ precision: 30, scale: 6 }).notNull(),
	supplyCapacity: decimal({ precision: 30, scale: 6 }).notNull(),
});

export const shipDesignsRelations = relations(shipDesigns, ({ one, many }) => ({
	game: one(games, { fields: [shipDesigns.gameId], references: [games.id] }),
	owner: one(users, { fields: [shipDesigns.ownerId], references: [users.id] }),
	previousDesign: one(shipDesigns, {
		fields: [shipDesigns.previousDesignId],
		references: [shipDesigns.id],
	}),
	resourceCosts: many(shipDesignResourceCosts),
}));

export const shipDesignResourceCosts = pgTable(
	"shipDesignResourceCosts",
	{
		shipDesignId: uuid()
			.notNull()
			.references(() => shipDesigns.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		quantity: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.shipDesignId, table.resourceId],
		}),
	}),
);

export const shipDesignResourceCostsRelations = relations(
	shipDesignResourceCosts,
	({ one }) => ({
		resource: one(resources, {
			fields: [shipDesignResourceCosts.resourceId],
			references: [resources.id],
		}),
		shipDesign: one(shipDesigns, {
			fields: [shipDesignResourceCosts.shipDesignId],
			references: [shipDesigns.id],
		}),
	}),
);
