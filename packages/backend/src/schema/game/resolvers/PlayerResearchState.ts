import type { PlayerResearchStateResolvers } from "./../../types.generated.js";
export const PlayerResearchState: PlayerResearchStateResolvers = {
	breakthroughCount: async (parent) => {
		return parent.breakthroughCount;
	},
	category: async (parent) => {
		return parent.category;
	},
	consecutivePrimary: async (parent) => {
		return parent.consecutivePrimary;
	},
	cumulativeMomentum: async (parent) => {
		return Number(parent.cumulativeMomentum ?? 0);
	},
	lastUpdatedTurn: async (parent) => {
		return parent.lastUpdatedTurn;
	},
	phase: async (parent) => {
		return parent.phase;
	},
	recentEvidence: async (parent) => {
		return Number(parent.recentEvidence ?? 0);
	},
	synthesisProgress: async (parent) => {
		return Number(parent.synthesisProgress ?? 0);
	},
};
