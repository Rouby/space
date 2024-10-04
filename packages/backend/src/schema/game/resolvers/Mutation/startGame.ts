import { eq, games } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { MutationResolvers } from "./../../../types.generated.js";
export const startGame: NonNullable<MutationResolvers["startGame"]> = async (
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

	await ctx.drizzle
		.update(games)
		.set({ startedAt: new Date() })
		.where(eq(games.id, id));

	ctx.startGame(id);

	return game;
};
