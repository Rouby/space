import { relations, sql } from "drizzle-orm";
import {
	decimal,
	index,
	integer,
	jsonb,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { researchCategories } from "./research.ts";
import { users } from "./users.ts";

export const researchMiniGameTypes = [
	"evidence_triangulation",
	"breakthrough_incident",
] as const;

export type ResearchMiniGameType = (typeof researchMiniGameTypes)[number];

export const researchMiniGameRiskTags = ["safe", "balanced", "risky"] as const;

export type ResearchMiniGameRiskTag = (typeof researchMiniGameRiskTags)[number];

export const playerResearchMiniGameActions = pgTable(
	"playerResearchMiniGameActions",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		playerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		turnNumber: integer().notNull(),
		miniGameType: varchar({
			length: 64,
			enum: researchMiniGameTypes,
		}).notNull(),
		targetCategory: varchar({
			length: 32,
			enum: researchCategories,
		}).notNull(),
		promptSeed: integer().notNull(),
		qualityScore: decimal({ precision: 10, scale: 6 }).notNull(),
		confidenceScore: decimal({ precision: 10, scale: 6 }).notNull(),
		bonus: decimal({ precision: 10, scale: 6 }).notNull(),
		riskTag: varchar({
			length: 16,
			enum: researchMiniGameRiskTags,
		}).notNull(),
		actionSummary: jsonb().$type<Record<string, unknown>>().notNull(),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex().on(table.gameId, table.playerId, table.turnNumber),
		index().on(table.gameId, table.turnNumber),
		index().on(table.gameId, table.playerId, table.targetCategory),
	],
);

export const playerResearchMiniGameActionsRelations = relations(
	playerResearchMiniGameActions,
	({ one }) => ({
		game: one(games, {
			fields: [playerResearchMiniGameActions.gameId],
			references: [games.id],
		}),
		player: one(users, {
			fields: [playerResearchMiniGameActions.playerId],
			references: [users.id],
		}),
	}),
);
