import type { ResearchMiniGameCardResolvers } from "./../../types.generated.js";
export const ResearchMiniGameCard: ResearchMiniGameCardResolvers = {
	id: async (parent) => parent.id,
	label: async (parent) => parent.label,
	relevance: async (parent) => parent.relevance,
	tag: async (parent) => parent.tag,
};
