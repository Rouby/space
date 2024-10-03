import { games, players } from "@space/data/schema";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createGame: NonNullable<MutationResolvers["createGame"]> = async (
	_parent,
	{ name },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle.transaction(async (tx) => {
		const game = await tx
			.insert(games)
			.values({ name })
			.returning()
			.then((games) => games[0]);

		await tx.insert(players).values({
			gameId: game.id,
			userId: ctx.userId as string,
		});

		return game;
	});
};
