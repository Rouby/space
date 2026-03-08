import { and, eq, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const joinGame: NonNullable<MutationResolvers["joinGame"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: (game, { eq }) => eq(game.id, id),
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "GAME_NOT_FOUND" },
		});
	}

	if (game.startedAt) {
		throw createGraphQLError("Cannot join a game that has already started", {
			extensions: { code: "GAME_ALREADY_STARTED" },
		});
	}

	const existingMembership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, id),
			eq(players.userId, ctx.userId as string),
		),
	});

	if (existingMembership) {
		return game;
	}

	try {
		await ctx.drizzle
			.insert(players)
			.values({ gameId: id, userId: ctx.userId as string });
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "23505"
		) {
			// Duplicate membership can occur in concurrent joins; treat as idempotent success.
			return game;
		}

		throw error;
	}

	return game;
};
