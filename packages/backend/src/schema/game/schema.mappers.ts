import type {
	games,
	players,
	TurnReportColonizationCompleted,
	TurnReportColonizationPressureChange,
	TurnReportIndustrialProjectCompletion,
	TurnReportIndustryChange,
	TurnReportMiningChange,
	TurnReportPopulationChange,
	TurnReportPopulationMigration,
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
export type TurnReportColonizationPressureChangeMapper =
	TurnReportColonizationPressureChange;
export type TurnReportColonizationCompletedMapper =
	TurnReportColonizationCompleted;
export type TurnReportPopulationMigrationMapper = TurnReportPopulationMigration;
