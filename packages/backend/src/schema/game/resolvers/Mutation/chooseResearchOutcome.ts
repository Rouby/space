import {
	effectiveBonus,
	parseResearchCategory,
	researchCategories,
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
	playerResearchStates,
	players,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.ts";

export const chooseResearchOutcome: NonNullable<
	MutationResolvers["chooseResearchOutcome"]
> = async (
	_parent,
	{ category, gameId, outcomeKey, outcomeMode },
	ctx: Context,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const normalizedCategory = parseResearchCategory(category);
	if (!normalizedCategory) {
		throw createGraphQLError("Invalid research category", {
			extensions: {
				code: "INVALID_RESEARCH_CATEGORY",
				validValues: researchCategories,
			},
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, gameId),
		columns: { id: true, turnNumber: true, startedAt: true },
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "GAME_NOT_FOUND" },
		});
	}

	if (!game.startedAt) {
		throw createGraphQLError("Game has not started yet", {
			extensions: { code: "GAME_NOT_STARTED" },
		});
	}

	const player = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, gameId),
			eq(players.userId, ctx.userId ?? ""),
		),
		with: { user: true },
	});

	if (!player) {
		throw createGraphQLError("Not authorized to choose research outcomes", {
			extensions: { code: "NOT_AUTHORIZED" },
		});
	}

	const state = await ctx.drizzle.query.playerResearchStates.findFirst({
		where: and(
			eq(playerResearchStates.gameId, gameId),
			eq(playerResearchStates.playerId, player.userId),
			eq(playerResearchStates.category, normalizedCategory),
		),
	});

	if (!state) {
		throw createGraphQLError("Research state not found", {
			extensions: { code: "RESEARCH_STATE_NOT_FOUND" },
		});
	}

	if (
		state.phase !== "synthesis" ||
		Number(state.synthesisProgress ?? 0) <
			synthesisThreshold(state.breakthroughCount)
	) {
		throw createGraphQLError(
			"This category has no synthesized outcome awaiting choice",
			{
				extensions: { code: "NO_PENDING_RESEARCH_OUTCOME" },
			},
		);
	}

	const directive = await ctx.drizzle.query.playerResearchDirectives.findFirst({
		where: and(
			eq(playerResearchDirectives.gameId, gameId),
			eq(playerResearchDirectives.playerId, player.userId),
			lte(playerResearchDirectives.turnNumber, game.turnNumber),
		),
		orderBy: [desc(playerResearchDirectives.turnNumber)],
		columns: { secondaryCategory: true },
	});

	if (!directive) {
		throw createGraphQLError("Research directive not found", {
			extensions: { code: "RESEARCH_DIRECTIVE_NOT_FOUND" },
		});
	}

	const existingOutcomes = await ctx.drizzle
		.select({ outcomeKey: playerResearchOutcomes.outcomeKey })
		.from(playerResearchOutcomes)
		.where(
			and(
				eq(playerResearchOutcomes.gameId, gameId),
				eq(playerResearchOutcomes.playerId, player.userId),
			),
		);
	const ownedOutcomeKeys = new Set(
		existingOutcomes.map((outcome) => outcome.outcomeKey),
	);

	const candidateOutcomes = resolveOutcomeCandidates(
		normalizedCategory,
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

	const selectedOutcome = candidateOutcomes.find(
		(candidate) => candidate.key === outcomeKey,
	);

	if (!selectedOutcome) {
		throw createGraphQLError("Selected outcome is not currently available", {
			extensions: { code: "INVALID_RESEARCH_OUTCOME_CHOICE" },
		});
	}

	const selectedMode = selectedOutcome.modes.find(
		(mode) => mode.mode === outcomeMode,
	);

	if (!selectedMode) {
		throw createGraphQLError(
			"Selected outcome mode is not valid for this choice",
			{
				extensions: { code: "INVALID_RESEARCH_OUTCOME_MODE" },
			},
		);
	}

	const normalizedModifier =
		effectiveBonus(Math.abs(selectedMode.modifier)) *
		Math.sign(selectedMode.modifier || 1);

	await ctx.drizzle.insert(playerResearchOutcomes).values({
		gameId,
		playerId: player.userId,
		category: normalizedCategory,
		turnNumber: game.turnNumber,
		outcomeKey: selectedOutcome.key,
		outcomeMode: selectedMode.mode,
		stat: selectedMode.stat,
		modifier: normalizedModifier.toFixed(6),
	});

	await ctx.drizzle
		.update(playerResearchStates)
		.set({
			breakthroughCount: state.breakthroughCount + 1,
			phase: "hypothesis",
			cumulativeMomentum: "0.000000",
			recentEvidence: (Number(state.recentEvidence ?? 0) * 0.5).toFixed(6),
			synthesisProgress: "0.000000",
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(playerResearchStates.gameId, gameId),
				eq(playerResearchStates.playerId, player.userId),
				eq(playerResearchStates.category, normalizedCategory),
			),
		);

	return player;
};
