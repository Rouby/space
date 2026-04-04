import { sql } from "drizzle-orm";
import {
	customType,
	jsonb,
	pgTable,
	point,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import type { ResearchCategory } from "./research.ts";
import { users } from "./users.ts";

export const dilemmaPromptNames = [
	"startingDilemmaFollowUp1",
	"startingDilemmaFollowUp2",
] as const;

export type DilemmaPromptName = (typeof dilemmaPromptNames)[number];

export const dilemmaTriggers = [
	"opening",
	"colonizationCompleted",
	"researchBreakthrough",
	"battleResolved",
	"inactivity",
] as const;

export type DilemmaTrigger = (typeof dilemmaTriggers)[number];

const reference = customType<{
	data: { id: string; origin: "dilemmas" | "starSystems" };
}>({
	dataType(_config) {
		return "jsonb";
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
});

export const dilemmas = pgTable("dilemmas", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	title: text().notNull(),
	description: text().notNull(),
	question: text().notNull(),
	choices: jsonb().notNull().$type<
		{
			id: string;
			title: string;
			description: string;
			effects: ChoiceEffect[];
		}[]
	>(),
	choosen: varchar({ length: 256 }),
	position: point({ mode: "xy" }),
	correlation: reference(),
	causation: reference(),
});

export type ChoiceEffect =
	| GenerateDilemmaEffect
	| ModifyHomeSystemEffect
	| ModifyResearchMomentumEffect
	| ModifyHomePopulationEffect;

export interface GenerateDilemmaEffect {
	type: "generateDilemma";
	params: {
		promptName: DilemmaPromptName;
	};
}

export interface ModifyHomeSystemEffect {
	type: "modifyHomeSystem";
	params: {
		industryDelta?: number;
		discoverySlotsDelta?: number;
		populationGrowthBonusDelta?: string;
		constructionCostModifierDelta?: string;
	};
}

export interface ModifyResearchMomentumEffect {
	type: "modifyResearchMomentum";
	params: {
		category: ResearchCategory;
		delta: string;
	};
}

export interface ModifyHomePopulationEffect {
	type: "modifyHomePopulation";
	params: {
		delta: string;
	};
}
