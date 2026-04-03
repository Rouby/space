import type { PlayerResearchDirectiveResolvers } from "./../../types.generated.js";
export const PlayerResearchDirective: PlayerResearchDirectiveResolvers = {
	methodology: async (parent) => {
		return parent.methodology;
	},
	primaryCategory: async (parent) => {
		return parent.primaryCategory;
	},
	secondaryCategory: async (parent) => {
		return parent.secondaryCategory;
	},
	turnNumber: async (parent) => {
		return parent.turnNumber;
	},
};
