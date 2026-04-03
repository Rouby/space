import type { ResearchMiniGamePromptResolvers } from "./../../types.generated.js";
export const ResearchMiniGamePrompt: ResearchMiniGamePromptResolvers = {
	incidentSteps: async (parent) => parent.incidentSteps,
	miniGameType: async (parent) => parent.miniGameType,
	promptDescription: async (parent) => parent.promptDescription,
	promptSeed: async (parent) => parent.promptSeed,
	promptTitle: async (parent) => parent.promptTitle,
	submitted: async (parent) => parent.submitted,
	submittedBonus: async (parent) => parent.submittedBonus,
	submittedConfidenceScore: async (parent) => parent.submittedConfidenceScore,
	submittedQualityScore: async (parent) => parent.submittedQualityScore,
	submittedRiskTag: async (parent) => parent.submittedRiskTag,
	targetCategory: async (parent) => parent.targetCategory,
	triangulationCards: async (parent) => parent.triangulationCards,
};
