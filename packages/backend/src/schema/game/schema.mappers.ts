import type {
	games,
	players,
	TurnReportMiningChange,
	TurnReportPopulationChange,
	TurnReportIndustryChange,
	TurnReportIndustrialProjectCompletion,
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
