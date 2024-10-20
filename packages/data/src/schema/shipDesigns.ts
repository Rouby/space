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
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid("ownerId")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar("name", { length: 256 }).notNull(),
	description: text("description").notNull(),
	decommissioned: boolean("decommissioned").notNull().default(false),
	previousDesignId: uuid("previousVersionId").references(
		(): AnyPgColumn => shipDesigns.id,
		{ onDelete: "restrict" },
	),
	hullRating: decimal("hullRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	speedRating: decimal("speedRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	armorRating: decimal("armorRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	shieldRating: decimal("shieldRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	weaponRating: decimal("weaponRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	zoneOfControlRating: decimal("zoneOfControlRating", {
		precision: 30,
		scale: 6,
	}).notNull(),
	sensorRating: decimal("sensorRating", {
		precision: 30,
		scale: 6,
	})
		.notNull()
		.default("1"),
	supplyNeed: decimal("supplyNeed", {
		precision: 30,
		scale: 6,
	}).notNull(),
	supplyCapacity: decimal("supplyCapacity", {
		precision: 30,
		scale: 6,
	}).notNull(),
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
		shipDesignId: uuid("shipDesignId")
			.notNull()
			.references(() => shipDesigns.id, { onDelete: "cascade" }),
		resourceId: uuid("resourceId")
			.notNull()
			.references(() => resources.id, { onDelete: "restrict" }),
		quantity: decimal("quantity", { precision: 30, scale: 6 }).notNull(),
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
