import { players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { MutationResolvers } from "./../../../types.generated.js";
export const joinGame: NonNullable<MutationResolvers["joinGame"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: (game, { eq }) => eq(game.id, id),
	});

	if (!game) {
		throw createGraphQLError("Game not found");
	}

	await ctx.drizzle
		.insert(players)
		.values({ gameId: id, userId: ctx.userId as string });

	return game;
};
