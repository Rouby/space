import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

export const updatePlayer: NonNullable<
	MutationResolvers["updatePlayer"]
> = async (_parent, { gameId, input }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, gameId),
	});

	if (!game) {
		throw createGraphQLError("Game not found");
	}

	if (game.startedAt) {
		throw createGraphQLError("Cannot update player after game has started");
	}

	const player = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, gameId),
			eq(players.userId, ctx.userId as string),
		),
		with: { user: true },
	});

	if (!player) {
		throw createGraphQLError("Player not found");
	}

	const updates: Partial<typeof player> = {};

	if (input.color) {
		updates.color = input.color;
	}

	if (Object.keys(updates).length > 0) {
		await ctx.drizzle
			.update(players)
			.set(updates)
			.where(
				and(
					eq(players.gameId, gameId),
					eq(players.userId, ctx.userId as string),
				),
			);
	}

	return { ...player, ...updates };
};
