import type { QueryResolvers } from "./../../../types.generated";
export const games: NonNullable<QueryResolvers['games']> = async (
	_parent,
	_arg,
	_ctx,
) => {
	/* Implement Query.games resolver logic here */
	return [{ id: "123", name: "Test" }];
};
