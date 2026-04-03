import type { PlayerResearchOutcomeResolvers } from "./../../types.generated.js";
export const PlayerResearchOutcome: PlayerResearchOutcomeResolvers = {
	category: async (parent) => {
		return parent.category;
	},
	id: async (parent) => {
		return parent.id;
	},
	modifier: async (parent) => {
		return Number(parent.modifier ?? 0);
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
	turnNumber: async (parent) => {
		return parent.turnNumber;
	},
};
