import {
	parseResearchCategory,
	parseResearchMethodology,
	researchCategories,
	researchMethodologies,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	playerResearchDirectives,
	players,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.ts";

export const setResearchFocus: NonNullable<
	MutationResolvers["setResearchFocus"]
> = async (
	_parent,
	{ gameId, methodology, primaryCategory, secondaryCategory },
	ctx: Context,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const normalizedPrimary = parseResearchCategory(primaryCategory);
	const normalizedSecondary = parseResearchCategory(secondaryCategory);
	const normalizedMethodology = parseResearchMethodology(methodology);

	if (!normalizedPrimary || !normalizedSecondary) {
		throw createGraphQLError("Invalid research category", {
			extensions: {
				code: "INVALID_RESEARCH_CATEGORY",
				validValues: researchCategories,
			},
		});
	}

	if (!normalizedMethodology) {
		throw createGraphQLError("Invalid research methodology", {
			extensions: {
				code: "INVALID_RESEARCH_METHOD",
				validValues: researchMethodologies,
			},
		});
	}

	if (normalizedPrimary === normalizedSecondary) {
		throw createGraphQLError(
			"Primary and secondary research categories must be different",
			{
				extensions: {
					code: "INVALID_RESEARCH_DIRECTIVE",
				},
			},
		);
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
		throw createGraphQLError(
			"Not authorized to configure research in this game",
			{
				extensions: { code: "NOT_AUTHORIZED" },
			},
		);
	}

	await ctx.drizzle
		.update(playerResearchDirectives)
		.set({
			primaryCategory: normalizedPrimary,
			secondaryCategory: normalizedSecondary,
			methodology: normalizedMethodology,
		})
		.where(
			and(
				eq(playerResearchDirectives.gameId, gameId),
				eq(playerResearchDirectives.playerId, player.userId),
				eq(playerResearchDirectives.turnNumber, game.turnNumber),
			),
		)
		.returning({ id: playerResearchDirectives.id });

	const existingDirective =
		await ctx.drizzle.query.playerResearchDirectives.findFirst({
			where: and(
				eq(playerResearchDirectives.gameId, gameId),
				eq(playerResearchDirectives.playerId, player.userId),
				eq(playerResearchDirectives.turnNumber, game.turnNumber),
			),
			columns: { id: true },
		});

	if (!existingDirective) {
		await ctx.drizzle.insert(playerResearchDirectives).values({
			gameId,
			playerId: player.userId,
			turnNumber: game.turnNumber,
			primaryCategory: normalizedPrimary,
			secondaryCategory: normalizedSecondary,
			methodology: normalizedMethodology,
		});
	}

	return player;
};
