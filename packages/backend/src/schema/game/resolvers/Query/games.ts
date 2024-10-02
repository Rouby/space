import type { QueryResolvers } from "./../../../types.generated";
export const games: NonNullable<QueryResolvers["games"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle.query.games.findMany();
};
