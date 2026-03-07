import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const updateGameSettings: NonNullable<
	MutationResolvers["updateGameSettings"]
> = async (_parent, { gameId, input }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	if (!ctx.userId) {
		throw createGraphQLError("Not authenticated");
	}

	const player = await ctx.drizzle.query.players.findFirst({
		where: and(eq(players.gameId, gameId), eq(players.userId, ctx.userId)),
	});

	if (!player) {
		throw createGraphQLError("Not a player in this game");
	}

	const updatePayload: Partial<{
		autoEndTurnAfterHoursInactive: number;
		autoEndTurnEveryHours: number;
	}> = {};

	if (
		input.autoEndTurnAfterHoursInactive !== null &&
		input.autoEndTurnAfterHoursInactive !== undefined
	) {
		updatePayload.autoEndTurnAfterHoursInactive =
			input.autoEndTurnAfterHoursInactive;
	}
	if (
		input.autoEndTurnEveryHours !== null &&
		input.autoEndTurnEveryHours !== undefined
	) {
		updatePayload.autoEndTurnEveryHours = input.autoEndTurnEveryHours;
	}

	const [game] = await ctx.drizzle
		.update(games)
		.set(updatePayload)
		.where(eq(games.id, gameId))
		.returning();

	return game;
};
