import type { TurnReportResolvers } from "./../../types.generated.ts";

export const TurnReport: TurnReportResolvers = {
	populationChanges: async (parent, _arg, _ctx) => {
		return parent.summary.populationChanges || [];
	},
	miningChanges: async (parent, _arg, _ctx) => {
		return parent.summary.miningChanges || [];
	},
	industryChanges: async (parent, _arg, _ctx) => {
		return parent.summary.industryChanges || [];
	},
	industrialProjectCompletions: async (parent, _arg, _ctx) => {
		return parent.summary.industrialProjectCompletions || [];
	},
	createdAt: async (parent, _arg, _ctx) => {
		return parent.createdAt;
	},
	id: async (parent, _arg, _ctx) => {
		return parent.id;
	},
	turnNumber: async (parent, _arg, _ctx) => {
		return parent.turnNumber;
	},
};
