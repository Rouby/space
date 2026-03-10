import { relations, sql } from "drizzle-orm";
import {
	bigint,
	decimal,
	index,
	integer,
	pgTable,
	point,
	primaryKey,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { resources } from "./resources.ts";
import { users } from "./users.ts";

export const industrialProjectTypes = [
	"factory_expansion",
	"automation_hub",
	"orbital_foundry",
] as const;

export type IndustrialProjectType = (typeof industrialProjectTypes)[number];

export const starSystems = pgTable("starSystems", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar({ length: 256 }).notNull(),
	position: point({ mode: "xy" }).notNull(),
	ownerId: uuid().references(() => users.id, { onDelete: "restrict" }),
	industry: integer().notNull().default(0),
	discoverySlots: integer().notNull().default(0),
	discoveryProgress: decimal({ precision: 10, scale: 9 })
		.notNull()
		.default("0"),
});

export const starSystemsRelations = relations(starSystems, ({ one, many }) => ({
	game: one(games, { fields: [starSystems.gameId], references: [games.id] }),
	owner: one(users, { fields: [starSystems.ownerId], references: [users.id] }),
	developmentStances: many(starSystemDevelopmentStances),
	industrialProjects: many(starSystemIndustrialProjects),
	resourceDiscoveries: many(starSystemResourceDiscoveries),
	resourceDepots: many(starSystemResourceDepots),
	populations: many(starSystemPopulations),
}));

export const starSystemIndustrialProjects = pgTable(
	"starSystemIndustrialProjects",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		projectType: varchar({
			length: 64,
			enum: industrialProjectTypes,
		}).notNull(),
		industryPerTurn: integer().notNull(),
		workRequired: integer().notNull(),
		workDone: integer().notNull().default(0),
		completionIndustryBonus: integer().notNull(),
		queuePosition: integer().notNull(),
		queuedAtTurn: integer().notNull(),
		startedAtTurn: integer(),
		completedAtTurn: integer(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		index().on(table.gameId, table.starSystemId, table.queuePosition),
		index().on(table.gameId, table.starSystemId, table.completedAtTurn),
		index().on(table.playerId, table.queuedAtTurn),
	],
);

export const starSystemIndustrialProjectsRelations = relations(
	starSystemIndustrialProjects,
	({ one }) => ({
		game: one(games, {
			fields: [starSystemIndustrialProjects.gameId],
			references: [games.id],
		}),
		starSystem: one(starSystems, {
			fields: [starSystemIndustrialProjects.starSystemId],
			references: [starSystems.id],
		}),
		player: one(users, {
			fields: [starSystemIndustrialProjects.playerId],
			references: [users.id],
		}),
	}),
);

export const starSystemDevelopmentStances = pgTable(
	"starSystemDevelopmentStances",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		turnNumber: integer().notNull(),
		stance: varchar({
			length: 32,
			enum: ["industrialize", "balance", "grow_population"],
		}).notNull(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex().on(table.gameId, table.starSystemId, table.turnNumber),
		index().on(table.gameId, table.turnNumber),
		index().on(table.playerId, table.turnNumber),
	],
);

export const starSystemDevelopmentStancesRelations = relations(
	starSystemDevelopmentStances,
	({ one }) => ({
		game: one(games, {
			fields: [starSystemDevelopmentStances.gameId],
			references: [games.id],
		}),
		starSystem: one(starSystems, {
			fields: [starSystemDevelopmentStances.starSystemId],
			references: [starSystems.id],
		}),
		player: one(users, {
			fields: [starSystemDevelopmentStances.playerId],
			references: [users.id],
		}),
	}),
);

export const starSystemResourceDiscoveries = pgTable(
	"starSystemResourceDiscoveries",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "cascade" }),
		discoveredAt: timestamp().notNull(),
		remainingDeposits: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.starSystemId, table.resourceId],
		}),
	],
);

export const starSystemResourceDepots = pgTable(
	"starSystemResourceDepots",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "cascade" }),
		quantity: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.starSystemId, table.resourceId],
		}),
	],
);

export const starSystemPopulations = pgTable(
	"starSystemPopulations",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		amount: bigint({ mode: "bigint" }).notNull(),
		growthLeftover: decimal({ precision: 10, scale: 9 }).notNull().default("0"),
		allegianceToPlayerId: uuid()
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
			}),
	},
	(table) => [
		primaryKey({
			columns: [table.starSystemId, table.allegianceToPlayerId],
		}),
	],
);

export const starSystemPopulationsRelations = relations(
	starSystemPopulations,
	({ one }) => ({
		starSystem: one(starSystems, {
			fields: [starSystemPopulations.starSystemId],
			references: [starSystems.id],
		}),
		allegianceToPlayer: one(users, {
			fields: [starSystemPopulations.allegianceToPlayerId],
			references: [users.id],
		}),
	}),
);

export const starSystemColonizationPressures = pgTable(
	"starSystemColonizationPressures",
	{
		starSystemId: uuid()
			.notNull()
			.references(() => starSystems.id, { onDelete: "cascade" }),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		ownerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		accumulatedPressure: decimal({ precision: 20, scale: 6 })
			.notNull()
			.default("0"),
		pressurePerTurn: decimal({ precision: 20, scale: 6 })
			.notNull()
			.default("0"),
	},
	(table) => [primaryKey({ columns: [table.starSystemId, table.ownerId] })],
);

export const starSystemColonizationPressuresRelations = relations(
	starSystemColonizationPressures,
	({ one }) => ({
		starSystem: one(starSystems, {
			fields: [starSystemColonizationPressures.starSystemId],
			references: [starSystems.id],
		}),
		game: one(games, {
			fields: [starSystemColonizationPressures.gameId],
			references: [games.id],
		}),
		owner: one(users, {
			fields: [starSystemColonizationPressures.ownerId],
			references: [users.id],
		}),
	}),
);
