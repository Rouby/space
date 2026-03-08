import { games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createGame: NonNullable<MutationResolvers["createGame"]> = async (
	_parent,
	{ name },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const normalizedName = name.trim();

	if (normalizedName.length < 3 || normalizedName.length > 64) {
		throw createGraphQLError("Game name must be between 3 and 64 characters", {
			extensions: { code: "INVALID_GAME_NAME" },
		});
	}

	return ctx.drizzle.transaction(async (tx) => {
		const game = await tx
			.insert(games)
			.values({
				name: normalizedName,
				hostUserId: ctx.userId as string,
			})
			.returning()
			.then((games) => games[0]);

		await tx.insert(players).values({
			gameId: game.id,
			userId: ctx.userId as string,
		});

		return game;
	});
};
