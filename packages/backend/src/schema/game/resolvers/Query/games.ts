import type { QueryResolvers } from "./../../../types.generated";
export const games: NonNullable<QueryResolvers["games"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	/* Implement Query.games resolver logic here */

	return [
		{ id: "123", name: "Test" },
		{ id: "124", name: "Test" },
	];
};
