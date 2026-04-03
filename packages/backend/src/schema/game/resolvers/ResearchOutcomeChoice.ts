import type { ResearchOutcomeChoiceResolvers } from "./../../types.generated.js";
export const ResearchOutcomeChoice: ResearchOutcomeChoiceResolvers = {
	displayName: async (parent) => parent.displayName,
	modifier: async (parent) => parent.modifier,
	outcomeKey: async (parent) => parent.outcomeKey,
	outcomeMode: async (parent) => parent.outcomeMode,
	stat: async (parent) => parent.stat,
};
