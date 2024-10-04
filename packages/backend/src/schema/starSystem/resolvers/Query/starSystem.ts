import { eq, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { QueryResolvers } from "./../../../types.generated.js";
export const starSystem: NonNullable<QueryResolvers["starSystem"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const starSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, id),
	});

	if (!starSystem) {
		throw createGraphQLError("Star system not found");
	}

	return starSystem;
};
