import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

export type TurnReportPopulationChange = {
	starSystemId: string;
	populationId: string;
	previousAmount: string;
	newAmount: string;
	growth: string;
};

export type TurnReportIndustryChange = {
	starSystemId: string;
	industryTotal: number;
	industryUtilized: number;
};

export type TurnReportIndustrialProjectCompletion = {
	starSystemId: string;
	projectType: string;
	industryBonus: number;
};

export type TurnReportTaskForceConstructionChange = {
	taskForceId: string;
	taskForceName: string;
	ownerId: string;
	starSystemId: string;
	previousDone: number;
	newDone: number;
	total: number;
	perTick: number;
	completed: boolean;
};

export type TurnReportMiningChange = {
	starSystemId: string;
	resourceId: string;
	mined: number;
	remainingDeposits: number;
	depotQuantity: number;
};

export type TurnReportTaskForceEngagement = {
	engagementId: string;
	status: "unresolved" | "resolved";
	taskForceAId: string;
	taskForceBId: string;
	taskForceAName: string;
	taskForceBName: string;
	winnerTaskForceId: string | null;
	location: { x: number; y: number };
};

export type TurnReportSummary = {
	populationChanges: TurnReportPopulationChange[];
	miningChanges: TurnReportMiningChange[];
	industryChanges: TurnReportIndustryChange[];
	industrialProjectCompletions: TurnReportIndustrialProjectCompletion[];
	taskForceConstructionChanges: TurnReportTaskForceConstructionChange[];
	taskForceEngagements: TurnReportTaskForceEngagement[];
};

export const turnReports = pgTable(
	"turnReports",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		ownerId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		turnNumber: integer().notNull(),
		summary: jsonb().$type<TurnReportSummary>().notNull(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		index().on(table.gameId, table.turnNumber),
		index().on(table.gameId, table.ownerId),
		index().on(table.ownerId, table.turnNumber),
	],
);

export const turnReportsRelations = relations(turnReports, ({ one }) => ({
	game: one(games, {
		fields: [turnReports.gameId],
		references: [games.id],
	}),
	owner: one(users, {
		fields: [turnReports.ownerId],
		references: [users.id],
	}),
}));
