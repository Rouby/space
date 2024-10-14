import { relations, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	pgTable,
	primaryKey,
	real,
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
	hullRating: real("hullRating").notNull(),
	speedRating: real("speedRating").notNull(),
	armorRating: real("armorRating").notNull(),
	shieldRating: real("shieldRating").notNull(),
	weaponRating: real("weaponRating").notNull(),
	zoneOfControlRating: real("zoneOfControlRating").notNull(),
	supplyNeed: real("supplyNeed").notNull(),
	supplyCapacity: real("supplyCapacity").notNull(),
});

export const shipDesignsRelations = relations(shipDesigns, ({ one }) => ({
	game: one(games, { fields: [shipDesigns.gameId], references: [games.id] }),
	owner: one(users, { fields: [shipDesigns.ownerId], references: [users.id] }),
	previousDesign: one(shipDesigns, {
		fields: [shipDesigns.previousDesignId],
		references: [shipDesigns.id],
	}),
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
		quantity: real("quantity").notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.shipDesignId, table.resourceId],
		}),
	}),
);
