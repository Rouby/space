import type { QueryResolvers } from "./../../../types.generated.js";
export const me: NonNullable<QueryResolvers["me"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	return ctx.userId
		? ctx.drizzle.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, ctx.userId ?? ""),
			})
		: null;
};
