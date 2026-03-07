import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "./../../../types.generated";
export const games: NonNullable<QueryResolvers["games"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle.query.games.findMany();
};
