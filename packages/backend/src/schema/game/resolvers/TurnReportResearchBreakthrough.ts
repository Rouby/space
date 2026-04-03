import type { TurnReportResearchBreakthroughResolvers } from "./../../types.generated.js";
export const TurnReportResearchBreakthrough: TurnReportResearchBreakthroughResolvers =
	{
		category: async (parent) => {
			return parent.category;
		},
		modifier: async (parent) => {
			return parent.modifier;
		},
		outcomeKey: async (parent) => {
			return parent.outcomeKey;
		},
		outcomeMode: async (parent) => {
			return parent.outcomeMode;
		},
		stat: async (parent) => {
			return parent.stat;
		},
	};
