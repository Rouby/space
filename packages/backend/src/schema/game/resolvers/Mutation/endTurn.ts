import { and, dilemmas, eq, games, isNull, players } from "@space/data/schema";
import { GraphQLError } from "graphql";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const endTurn: NonNullable<MutationResolvers["endTurn"]> = async (
	_parent,
	{ gameId },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const player = ctx.drizzle
		.select()
		.from(players)
		.where(and(eq(players.userId, context.userId), eq(players.gameId, gameId)));

	if (!player) {
		throw new GraphQLError("You are not a player in this game");
	}

	const hasUnresolvedDilemmas = await ctx.drizzle
		.select()
		.from(dilemmas)
		.where(
			and(
				eq(dilemmas.gameId, gameId),
				eq(dilemmas.ownerId, context.userId),
				isNull(dilemmas.choosen),
			),
		);

	if (hasUnresolvedDilemmas.length > 0) {
		throw new GraphQLError(
			"You cannot end your turn while there are unresolved dilemmas",
		);
	}

	await ctx.drizzle
		.update(players)
		.set({
			turnEndedAt: new Date(),
		})
		.where(and(eq(players.userId, context.userId), eq(players.gameId, gameId)));

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, gameId),
	});

	if (!game) {
		throw new GraphQLError("Game not found");
	}

	return game;
};
