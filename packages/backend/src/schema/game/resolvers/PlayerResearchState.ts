import {
	effectiveBonus,
	resolveOutcomeCandidates,
	synthesisThreshold,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	lte,
	playerResearchDirectives,
	playerResearchOutcomes,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
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
	pendingOutcomeChoices: async (parent, _arg, ctx) => {
		const currentProgress = Number(parent.synthesisProgress ?? 0);
		const threshold = synthesisThreshold(parent.breakthroughCount);
		if (parent.phase !== "synthesis" || currentProgress < threshold) {
			return [];
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return [];
		}

		const directive =
			await ctx.drizzle.query.playerResearchDirectives.findFirst({
				where: and(
					eq(playerResearchDirectives.gameId, parent.gameId),
					eq(playerResearchDirectives.playerId, parent.playerId),
					lte(playerResearchDirectives.turnNumber, game.turnNumber),
				),
				orderBy: [desc(playerResearchDirectives.turnNumber)],
				columns: { secondaryCategory: true },
			});

		if (!directive) {
			return [];
		}

		const existingOutcomes = await ctx.drizzle
			.select({ outcomeKey: playerResearchOutcomes.outcomeKey })
			.from(playerResearchOutcomes)
			.where(
				and(
					eq(playerResearchOutcomes.gameId, parent.gameId),
					eq(playerResearchOutcomes.playerId, parent.playerId),
				),
			);

		const ownedOutcomeKeys = new Set(
			existingOutcomes.map((outcome) => outcome.outcomeKey),
		);

		const topCandidates = resolveOutcomeCandidates(
			parent.category,
			directive.secondaryCategory,
		)
			.map((candidate) => {
				const owned = ownedOutcomeKeys.has(candidate.key);
				const novelty = owned ? 0.7 : 1;
				const antiDuplicate = owned ? 0.6 : 1;
				return {
					...candidate,
					score: candidate.baseWeight * novelty * antiDuplicate,
				};
			})
			.sort((a, b) => b.score - a.score)
			.slice(0, 2);

		return topCandidates.flatMap((candidate) =>
			candidate.modes.map((mode) => {
				const normalizedModifier =
					effectiveBonus(Math.abs(mode.modifier)) *
					Math.sign(mode.modifier || 1);
				return {
					outcomeKey: candidate.key,
					displayName: candidate.displayName,
					outcomeMode: mode.mode,
					stat: mode.stat,
					modifier: normalizedModifier,
				};
			}),
		);
	},
};
