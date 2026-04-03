import type { TurnReportResearchProgressChangeResolvers } from "./../../types.generated.js";
export const TurnReportResearchProgressChange: TurnReportResearchProgressChangeResolvers =
	{
		category: async (parent) => {
			return parent.category;
		},
		momentumGained: async (parent) => {
			return parent.momentumGained;
		},
		phase: async (parent) => {
			return parent.phase;
		},
		phaseChanged: async (parent) => {
			return parent.phaseChanged;
		},
		totalMomentum: async (parent) => {
			return parent.totalMomentum;
		},
	};
