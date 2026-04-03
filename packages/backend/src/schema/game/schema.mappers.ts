import type {
	games,
	playerResearchDirectives,
	playerResearchOutcomes,
	playerResearchStates,
	players,
	TurnReportColonizationCompleted,
	TurnReportColonizationPressureChange,
	TurnReportIndustrialProjectCompletion,
	TurnReportIndustryChange,
	TurnReportMiningChange,
	TurnReportPopulationChange,
	TurnReportPopulationMigration,
	TurnReportResearchBreakthrough,
	TurnReportResearchProgressChange,
	TurnReportTaskForceConstructionChange,
	turnReports,
	users,
} from "@space/data/schema";

export type GameMapper = typeof games.$inferSelect;
export type PlayerMapper = typeof players.$inferSelect & {
	user: typeof users.$inferSelect;
};
export type TurnReportMapper = typeof turnReports.$inferSelect;
export type TurnReportPopulationChangeMapper = TurnReportPopulationChange;
export type TurnReportMiningChangeMapper = TurnReportMiningChange;
export type TurnReportIndustryChangeMapper = TurnReportIndustryChange;
export type TurnReportIndustrialProjectCompletionMapper =
	TurnReportIndustrialProjectCompletion;
export type TurnReportTaskForceConstructionChangeMapper =
	TurnReportTaskForceConstructionChange;
export type TurnReportResearchProgressChangeMapper =
	TurnReportResearchProgressChange;
export type TurnReportResearchBreakthroughMapper =
	TurnReportResearchBreakthrough;
export type TurnReportColonizationPressureChangeMapper =
	TurnReportColonizationPressureChange;
export type TurnReportColonizationCompletedMapper =
	TurnReportColonizationCompleted;
export type TurnReportPopulationMigrationMapper = TurnReportPopulationMigration;
export type PlayerResearchDirectiveMapper =
	typeof playerResearchDirectives.$inferSelect;
export type PlayerResearchStateMapper =
	typeof playerResearchStates.$inferSelect;
export type PlayerResearchOutcomeMapper =
	typeof playerResearchOutcomes.$inferSelect;

export type ResearchMiniGameCardMapper = {
	id: string;
	label: string;
	relevance: number;
	tag: string;
};

export type ResearchMiniGameIncidentStepMapper = {
	step: number;
	title: string;
	safeSuccessChance: number;
	riskySuccessChance: number;
};

export type ResearchMiniGamePromptMapper = {
	miniGameType: "evidence_triangulation" | "breakthrough_incident";
	targetCategory: "military" | "industry" | "expansion" | "discovery";
	promptSeed: number;
	promptTitle: string;
	promptDescription: string;
	triangulationCards: ResearchMiniGameCardMapper[];
	incidentSteps: ResearchMiniGameIncidentStepMapper[];
	submitted: boolean;
	submittedBonus: number | null;
	submittedQualityScore: number | null;
	submittedConfidenceScore: number | null;
	submittedRiskTag: "safe" | "balanced" | "risky" | null;
};
