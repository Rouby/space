import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const startGame: NonNullable<MutationResolvers["startGame"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, id),
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "GAME_NOT_FOUND" },
		});
	}

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, id),
			eq(players.userId, ctx.userId as string),
		),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to start this game",
			code: "NOT_AUTHORIZED",
			reason: "start-game-not-member",
			details: { gameId: id },
		});
	}

	if (game.hostUserId !== ctx.userId) {
		context.denyAccess({
			message: "Not authorized to start this game",
			code: "NOT_AUTHORIZED",
			reason: "start-game-not-host",
			details: { gameId: id },
		});
	}

	if (game.startedAt) {
		throw createGraphQLError("Game has already started", {
			extensions: { code: "GAME_ALREADY_STARTED" },
		});
	}

	await ctx.drizzle
		.update(games)
		.set({ startedAt: new Date() })
		.where(eq(games.id, id));

	ctx.startGame(id);

	return game;
};
