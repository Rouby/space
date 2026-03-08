import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "./../../../types.generated.js";
export const game: NonNullable<QueryResolvers["game"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(eq(players.gameId, id), eq(players.userId, context.userId)),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to access this game",
			code: "NOT_AUTHORIZED",
			reason: "game-query-not-member",
			details: { gameId: id },
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, id),
	});

	if (!game) {
		throw createGraphQLError("Game not found");
	}

	return game;
};
