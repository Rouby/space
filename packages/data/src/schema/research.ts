import { relations, sql } from "drizzle-orm";
import {
	decimal,
	index,
	integer,
	pgTable,
	primaryKey,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

export const researchCategories = [
	"military",
	"industry",
	"expansion",
	"discovery",
] as const;

export type ResearchCategory = (typeof researchCategories)[number];

export const researchMethodologies = [
	"stable",
	"bold",
	"opportunistic",
] as const;

export type ResearchMethodology = (typeof researchMethodologies)[number];

export const researchPhases = ["hypothesis", "fieldwork", "synthesis"] as const;

export type ResearchPhase = (typeof researchPhases)[number];

export const playerResearchDirectives = pgTable(
	"playerResearchDirectives",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		turnNumber: integer().notNull(),
		primaryCategory: varchar({
			length: 32,
			enum: researchCategories,
		}).notNull(),
		secondaryCategory: varchar({
			length: 32,
			enum: researchCategories,
		}).notNull(),
		methodology: varchar({
			length: 32,
			enum: researchMethodologies,
		}).notNull(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex().on(table.gameId, table.playerId, table.turnNumber),
		index().on(table.gameId, table.turnNumber),
		index().on(table.playerId, table.turnNumber),
	],
);

export const playerResearchDirectivesRelations = relations(
	playerResearchDirectives,
	({ one }) => ({
		game: one(games, {
			fields: [playerResearchDirectives.gameId],
			references: [games.id],
		}),
		player: one(users, {
			fields: [playerResearchDirectives.playerId],
			references: [users.id],
		}),
	}),
);

export const playerResearchStates = pgTable(
	"playerResearchStates",
	{
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		category: varchar({
			length: 32,
			enum: researchCategories,
		}).notNull(),
		breakthroughCount: integer().notNull().default(0),
		phase: varchar({
			length: 16,
			enum: researchPhases,
		})
			.notNull()
			.default("hypothesis"),
		cumulativeMomentum: decimal({ precision: 18, scale: 6 })
			.notNull()
			.default("0"),
		recentEvidence: decimal({ precision: 18, scale: 6 }).notNull().default("0"),
		synthesisProgress: decimal({ precision: 18, scale: 6 })
			.notNull()
			.default("0"),
		consecutivePrimary: integer().notNull().default(0),
		lastUpdatedTurn: integer().notNull().default(0),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.gameId, table.playerId, table.category] }),
		index().on(table.gameId, table.playerId),
		index().on(table.gameId, table.category),
	],
);

export const playerResearchStatesRelations = relations(
	playerResearchStates,
	({ one }) => ({
		game: one(games, {
			fields: [playerResearchStates.gameId],
			references: [games.id],
		}),
		player: one(users, {
			fields: [playerResearchStates.playerId],
			references: [users.id],
		}),
	}),
);

export const playerResearchOutcomes = pgTable(
	"playerResearchOutcomes",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		category: varchar({
			length: 32,
			enum: researchCategories,
		}).notNull(),
		turnNumber: integer().notNull(),
		outcomeKey: varchar({ length: 128 }).notNull(),
		outcomeMode: varchar({ length: 32 }).notNull(),
		stat: varchar({ length: 64 }).notNull(),
		modifier: decimal({ precision: 10, scale: 6 }).notNull(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		index().on(table.gameId, table.playerId, table.turnNumber),
		index().on(table.gameId, table.playerId, table.category),
	],
);

export const playerResearchOutcomesRelations = relations(
	playerResearchOutcomes,
	({ one }) => ({
		game: one(games, {
			fields: [playerResearchOutcomes.gameId],
			references: [games.id],
		}),
		player: one(users, {
			fields: [playerResearchOutcomes.playerId],
			references: [users.id],
		}),
	}),
);
