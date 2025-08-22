import { and, eq, players } from "@space/data/schema";
import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated.js";
export const endTurn: NonNullable<MutationResolvers["endTurn"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const game = await ctx.db.game.findUnique({
		where: { id: _arg.gameId },
		include: { players: true },
	});

	if (!game) {
		throw new GraphQLError("Game not found");
	}

	const player = game.players.find((p) => p.id === ctx.user.id);

	if (!player) {
		throw new GraphQLError("You are not a player in this game");
	}

	await ctx.drizzle
		.update(players)
		.set({
			turnEndedAt: new Date(),
		})
		.where(and(eq(players.userId, player.userId), eq(players.gameId, game.id)));

	return game;
};
