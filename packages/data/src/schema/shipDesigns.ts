import { eq, relations, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	decimal,
	integer,
	pgTable,
	pgView,
	primaryKey,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { resources } from "./resources.ts";
import { shipComponents } from "./shipComponents.ts";
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
});

export const shipDesignsRelations = relations(shipDesigns, ({ one, many }) => ({
	game: one(games, { fields: [shipDesigns.gameId], references: [games.id] }),
	owner: one(users, { fields: [shipDesigns.ownerId], references: [users.id] }),
	previousDesign: one(shipDesigns, {
		fields: [shipDesigns.previousDesignId],
		references: [shipDesigns.id],
	}),
	resourceCosts: many(shipDesignResourceCosts),
	components: many(shipDesignComponents),
}));

export const shipDesignResourceCosts = pgTable(
	"shipDesignResourceCosts",
	{
		shipDesignId: uuid()
			.notNull()
			.references(() => shipDesigns.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "cascade" }),
		quantity: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.shipDesignId, table.resourceId],
		}),
	}),
);

export const shipDesignComponents = pgTable(
	"shipDesignComponents",
	{
		shipDesignId: uuid()
			.notNull()
			.references(() => shipDesigns.id, { onDelete: "cascade" }),
		shipComponentId: uuid()
			.notNull()
			.references(() => shipComponents.id, { onDelete: "restrict" }),
		position: integer().notNull().default(0),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.shipDesignId, table.position],
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

export const shipDesignComponentsRelations = relations(
	shipDesignComponents,
	({ one }) => ({
		resource: one(shipComponents, {
			fields: [shipDesignComponents.shipComponentId],
			references: [shipComponents.id],
		}),
		shipDesign: one(shipDesigns, {
			fields: [shipDesignComponents.shipDesignId],
			references: [shipDesigns.id],
		}),
	}),
);

export const shipDesignsWithStats = pgView("shipDesignsWithStats").as((qb) =>
	qb
		.select({
			id: shipDesigns.id,
			name: shipDesigns.name,
			description: shipDesigns.description,
			decommissioned: shipDesigns.decommissioned,
			previousDesignId: shipDesigns.previousDesignId,
			resourceCosts: sql<
				{ resourceId: string; quantity: string }[]
			>`jsonb_agg(jsonb_build_object('resourceId', ${shipDesignResourceCosts.resourceId}, 'quantity', ${shipDesignResourceCosts.quantity}))`.as(
				"resourceCosts",
			),
			components: sql<
				(typeof shipComponents.$inferSelect)[]
			>`jsonb_agg(${shipComponents})`.as("components"),

			// general stats
			supplyNeedPassive: sql`sum(${shipComponents.supplyNeedPassive})`
				.mapWith(shipComponents.supplyNeedPassive)
				.as("supplyNeedPassive"),
			supplyNeedMovement: sql`sum(${shipComponents.supplyNeedMovement})`
				.mapWith(shipComponents.supplyNeedMovement)
				.as("supplyNeedMovement"),
			supplyNeedCombat: sql`sum(${shipComponents.supplyNeedCombat})`
				.mapWith(shipComponents.supplyNeedCombat)
				.as("supplyNeedCombat"),
			powerNeed: sql`sum(${shipComponents.powerNeed})`
				.mapWith(shipComponents.powerNeed)
				.as("powerNeed"),
			crewNeed: sql`sum(${shipComponents.crewNeed})`
				.mapWith(shipComponents.crewNeed)
				.as("crewNeed"),
			constructionCost: sql`sum(${shipComponents.constructionCost})`
				.mapWith(shipComponents.constructionCost)
				.as("constructionCost"),

			supplyCapacity: sql`sum(${shipComponents.supplyCapacity})`
				.mapWith(shipComponents.supplyCapacity)
				.as("supplyCapacity"),
			powerGeneration: sql`sum(${shipComponents.powerGeneration})`
				.mapWith(shipComponents.powerGeneration)
				.as("powerGeneration"),
			crewCapacity: sql`sum(${shipComponents.crewCapacity})`
				.mapWith(shipComponents.crewCapacity)
				.as("crewCapacity"),

			// strategic stats
			ftlSpeed: sql`min(${shipComponents.ftlSpeed})`
				.mapWith(shipComponents.ftlSpeed)
				.as("ftlSpeed"),
			zoneOfControl: sql`max(${shipComponents.zoneOfControl})`
				.mapWith(shipComponents.zoneOfControl)
				.as("zoneOfControl"),
			sensorRange: sql`max(${shipComponents.sensorRange})`
				.mapWith(shipComponents.sensorRange)
				.as("sensorRange"),

			componentCount: sql<number>`count(${shipComponents.id})`.as(
				"componentCount",
			),
			maxStructuralIntegrity: sql`sum(${shipComponents.structuralIntegrity})`
				.mapWith(shipComponents.structuralIntegrity)
				.as("structuralIntegrity"),
		})
		.from(shipDesigns)
		.innerJoin(
			shipDesignResourceCosts,
			eq(shipDesigns.id, shipDesignResourceCosts.shipDesignId),
		)
		.innerJoin(
			shipDesignComponents,
			eq(shipDesigns.id, shipDesignComponents.shipDesignId),
		)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.groupBy(shipDesigns.id),
);
