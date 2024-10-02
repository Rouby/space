import { games } from "@space/data/schema";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createGame: NonNullable<MutationResolvers["createGame"]> = async (
	_parent,
	{ name },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle
		.insert(games)
		.values({ name })
		.returning()
		.then((games) => games[0]);
};
