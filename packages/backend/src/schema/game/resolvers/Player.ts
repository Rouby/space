import {
	buildResearchMiniGamePrompt,
	defaultResearchMethodology,
	defaultResearchPrimaryCategory,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	lte,
	playerResearchDirectives,
	playerResearchMiniGameActions,
	playerResearchOutcomes,
	playerResearchStates,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<
	PlayerResolvers,
	| "color"
	| "currentResearchDirective"
	| "id"
	| "name"
	| "researchMiniGamePrompt"
	| "researchOutcomes"
	| "researchStates"
	| "turnEnded"
	| "user"
> = {
	id: async (parent, _arg, _ctx) => {
		return `${parent.gameId}-${parent.userId}`;
	},
	color: async (_parent, _arg, _ctx) => {
		return _parent.color;
	},
	name: async (parent, _arg, _ctx) => {
		return parent.user.name;
	},
	user: async (_parent, _arg, _ctx) => {
		return _parent.user;
	},
	turnEnded: async (_parent, _arg, _ctx) => {
		return !!_parent.turnEndedAt;
	},
	currentResearchDirective: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		return ctx.drizzle.query.playerResearchDirectives.findFirst({
			where: and(
				eq(playerResearchDirectives.gameId, parent.gameId),
				eq(playerResearchDirectives.playerId, parent.userId),
				lte(playerResearchDirectives.turnNumber, game.turnNumber),
			),
			orderBy: [desc(playerResearchDirectives.turnNumber)],
		});
	},
	researchMiniGamePrompt: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		const [directive, states, existingAction] = await Promise.all([
			ctx.drizzle.query.playerResearchDirectives.findFirst({
				where: and(
					eq(playerResearchDirectives.gameId, parent.gameId),
					eq(playerResearchDirectives.playerId, parent.userId),
					lte(playerResearchDirectives.turnNumber, game.turnNumber),
				),
				orderBy: [desc(playerResearchDirectives.turnNumber)],
				columns: {
					primaryCategory: true,
					methodology: true,
				},
			}),
			ctx.drizzle.query.playerResearchStates.findMany({
				where: and(
					eq(playerResearchStates.gameId, parent.gameId),
					eq(playerResearchStates.playerId, parent.userId),
				),
				columns: {
					category: true,
					phase: true,
					recentEvidence: true,
					synthesisProgress: true,
					breakthroughCount: true,
					consecutivePrimary: true,
				},
			}),
			ctx.drizzle.query.playerResearchMiniGameActions.findFirst({
				where: and(
					eq(playerResearchMiniGameActions.gameId, parent.gameId),
					eq(playerResearchMiniGameActions.playerId, parent.userId),
					eq(playerResearchMiniGameActions.turnNumber, game.turnNumber),
				),
				columns: {
					bonus: true,
					qualityScore: true,
					confidenceScore: true,
					riskTag: true,
				},
			}),
		]);

		const prompt = buildResearchMiniGamePrompt({
			turnNumber: game.turnNumber,
			playerId: parent.userId,
			primaryCategory:
				directive?.primaryCategory ?? defaultResearchPrimaryCategory,
			methodology: directive?.methodology ?? defaultResearchMethodology,
			researchStates: states.map((state) => ({
				category: state.category,
				phase: state.phase,
				recentEvidence: Number(state.recentEvidence ?? 0),
				synthesisProgress: Number(state.synthesisProgress ?? 0),
				breakthroughCount: state.breakthroughCount,
				consecutivePrimary: state.consecutivePrimary,
			})),
		});

		if (!prompt) {
			return null;
		}

		return {
			...prompt,
			submitted: Boolean(existingAction),
			submittedBonus: existingAction ? Number(existingAction.bonus) : null,
			submittedQualityScore: existingAction
				? Number(existingAction.qualityScore)
				: null,
			submittedConfidenceScore: existingAction
				? Number(existingAction.confidenceScore)
				: null,
			submittedRiskTag: existingAction?.riskTag ?? null,
		};
	},
	researchStates: async (parent, _arg, ctx) => {
		return ctx.drizzle.query.playerResearchStates.findMany({
			where: and(
				eq(playerResearchStates.gameId, parent.gameId),
				eq(playerResearchStates.playerId, parent.userId),
			),
		});
	},
	researchOutcomes: async (parent, { limit }, ctx) => {
		const maxLimit = Math.min(Math.max(limit ?? 20, 1), 100);
		return ctx.drizzle.query.playerResearchOutcomes.findMany({
			where: and(
				eq(playerResearchOutcomes.gameId, parent.gameId),
				eq(playerResearchOutcomes.playerId, parent.userId),
			),
			orderBy: (outcomes, { desc }) => [desc(outcomes.turnNumber)],
			limit: maxLimit,
		});
	},
};
