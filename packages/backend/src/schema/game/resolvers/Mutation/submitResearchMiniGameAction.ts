import {
	buildResearchMiniGamePrompt,
	defaultResearchMethodology,
	defaultResearchPrimaryCategory,
	evaluateBreakthroughIncident,
	evaluateEvidenceTriangulation,
	parseResearchCategory,
	parseResearchMethodology,
	researchCategories,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	lte,
	playerResearchDirectives,
	playerResearchMiniGameActions,
	playerResearchStates,
	players,
	sql,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.ts";

export const submitResearchMiniGameAction: NonNullable<
	MutationResolvers["submitResearchMiniGameAction"]
> = async (
	_parent,
	{
		gameId,
		miniGameType,
		targetCategory,
		triangulationSupportCardId,
		triangulationConflictCardId,
		triangulationControlCardId,
		incidentStepOneRisky,
		incidentStepTwoRisky,
		incidentStepThreeRisky,
	},
	ctx: Context,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const normalizedCategory = parseResearchCategory(targetCategory);
	if (!normalizedCategory) {
		throw createGraphQLError("Invalid research category", {
			extensions: {
				code: "INVALID_RESEARCH_CATEGORY",
				validValues: researchCategories,
			},
		});
	}

	if (
		miniGameType !== "evidence_triangulation" &&
		miniGameType !== "breakthrough_incident"
	) {
		throw createGraphQLError("Invalid mini-game type", {
			extensions: {
				code: "INVALID_RESEARCH_MINI_GAME_TYPE",
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
		columns: { gameId: true, userId: true, turnEndedAt: true, color: true },
	});

	if (!player) {
		throw createGraphQLError("Not authorized to submit research mini-game", {
			extensions: { code: "NOT_AUTHORIZED" },
		});
	}

	if (player.turnEndedAt) {
		throw createGraphQLError("Turn already ended for this turn window", {
			extensions: { code: "TURN_ALREADY_ENDED" },
		});
	}

	const [directive, states] = await Promise.all([
		ctx.drizzle.query.playerResearchDirectives.findFirst({
			where: and(
				eq(playerResearchDirectives.gameId, gameId),
				eq(playerResearchDirectives.playerId, player.userId),
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
				eq(playerResearchStates.gameId, gameId),
				eq(playerResearchStates.playerId, player.userId),
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
	]);

	const methodology =
		parseResearchMethodology(directive?.methodology ?? "") ??
		defaultResearchMethodology;

	const prompt = buildResearchMiniGamePrompt({
		turnNumber: game.turnNumber,
		playerId: player.userId,
		primaryCategory:
			directive?.primaryCategory ?? defaultResearchPrimaryCategory,
		methodology,
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
		throw createGraphQLError("No research mini-game is available this turn", {
			extensions: { code: "NO_MINI_GAME_AVAILABLE" },
		});
	}

	if (
		prompt.miniGameType !== miniGameType ||
		prompt.targetCategory !== normalizedCategory
	) {
		throw createGraphQLError("Mini-game prompt does not match current turn", {
			extensions: { code: "MINI_GAME_PROMPT_MISMATCH" },
		});
	}

	const evaluation =
		miniGameType === "evidence_triangulation"
			? evaluateEvidenceTriangulation({
					prompt,
					supportCardId: triangulationSupportCardId ?? "",
					conflictCardId: triangulationConflictCardId ?? "",
					controlCardId: triangulationControlCardId ?? "",
					methodology,
				})
			: evaluateBreakthroughIncident({
					prompt,
					stepOneRisky: incidentStepOneRisky ?? false,
					stepTwoRisky: incidentStepTwoRisky ?? false,
					stepThreeRisky: incidentStepThreeRisky ?? false,
					methodology,
				});

	await ctx.drizzle
		.insert(playerResearchMiniGameActions)
		.values({
			gameId,
			playerId: player.userId,
			turnNumber: game.turnNumber,
			miniGameType,
			targetCategory: normalizedCategory,
			promptSeed: prompt.promptSeed,
			qualityScore: evaluation.qualityScore.toFixed(6),
			confidenceScore: evaluation.confidenceScore.toFixed(6),
			bonus: evaluation.bonus.toFixed(6),
			riskTag: evaluation.riskTag,
			actionSummary: evaluation.actionSummary,
			updatedAt: new Date(),
		})
		.onConflictDoUpdate({
			target: [
				playerResearchMiniGameActions.gameId,
				playerResearchMiniGameActions.playerId,
				playerResearchMiniGameActions.turnNumber,
			],
			set: {
				miniGameType,
				targetCategory: normalizedCategory,
				promptSeed: prompt.promptSeed,
				qualityScore: evaluation.qualityScore.toFixed(6),
				confidenceScore: evaluation.confidenceScore.toFixed(6),
				bonus: evaluation.bonus.toFixed(6),
				riskTag: evaluation.riskTag,
				actionSummary: evaluation.actionSummary,
				updatedAt: sql`now()`,
			},
		});

	return player;
};
