import { eq, games as gamesTable, inArray, players } from "@space/data/schema";
import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "./../../../types.generated.js";
export const games: NonNullable<QueryResolvers["games"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const memberships = await ctx.drizzle.query.players.findMany({
		columns: { gameId: true },
		where: eq(players.userId, context.userId),
	});

	if (memberships.length === 0) {
		return [];
	}

	return ctx.drizzle.query.games.findMany({
		where: inArray(
			gamesTable.id,
			memberships.map((membership) => membership.gameId),
		),
	});
};
