import { eq, relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	pgView,
	point,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
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
});

export const shipDesignsRelations = relations(shipDesigns, ({ one, many }) => ({
	game: one(games, { fields: [shipDesigns.gameId], references: [games.id] }),
	owner: one(users, { fields: [shipDesigns.ownerId], references: [users.id] }),
	components: many(shipDesignComponents),
}));

export const shipDesignComponents = pgTable(
	"shipDesignComponents",
	{
		shipDesignId: uuid()
			.notNull()
			.references(() => shipDesigns.id, { onDelete: "cascade" }),
		shipComponentId: uuid()
			.notNull()
			.references(() => shipComponents.id, { onDelete: "restrict" }),
		position: point({ mode: "xy" }).notNull(),
	},
	(table) => [index().on(table.shipDesignId, table.position)],
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
			shipDesignComponents,
			eq(shipDesigns.id, shipDesignComponents.shipDesignId),
		)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.groupBy(shipDesigns.id),
);
