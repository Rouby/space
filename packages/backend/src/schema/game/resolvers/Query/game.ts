import { eq, games } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { QueryResolvers } from "./../../../types.generated.js";
export const game: NonNullable<QueryResolvers["game"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, id),
	});

	if (!game) {
		throw createGraphQLError("Game not found");
	}

	return game;
};
