import type { ResearchMiniGameIncidentStepResolvers } from "./../../types.generated.js";
export const ResearchMiniGameIncidentStep: ResearchMiniGameIncidentStepResolvers =
	{
		riskySuccessChance: async (parent) => parent.riskySuccessChance,
		safeSuccessChance: async (parent) => parent.safeSuccessChance,
		step: async (parent) => parent.step,
		title: async (parent) => parent.title,
	};
