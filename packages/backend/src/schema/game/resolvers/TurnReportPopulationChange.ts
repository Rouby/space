import type { TurnReportPopulationChangeResolvers } from "./../../types.generated.ts";

export const TurnReportPopulationChange: TurnReportPopulationChangeResolvers = {
	growth: async (parent, _arg, _ctx) => {
		return BigInt(parent.growth);
	},
	newAmount: async (parent, _arg, _ctx) => {
		return BigInt(parent.newAmount);
	},
	populationId: async (parent, _arg, _ctx) => {
		return parent.populationId;
	},
	previousAmount: async (parent, _arg, _ctx) => {
		return BigInt(parent.previousAmount);
	},
	starSystemId: async (parent, _arg, _ctx) => {
		return parent.starSystemId;
	},
};
