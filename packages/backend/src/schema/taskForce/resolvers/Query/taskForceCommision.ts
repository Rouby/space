import { eq, taskForceCommisions } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { QueryResolvers } from "./../../../types.generated.js";
export const taskForceCommision: NonNullable<
	QueryResolvers["taskForceCommision"]
> = async (_parent, { id }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const taskForceCommision =
		await ctx.drizzle.query.taskForceCommisions.findFirst({
			where: eq(taskForceCommisions.id, id),
		});

	if (!taskForceCommision) {
		throw createGraphQLError("Star system not found");
	}

	return taskForceCommision;
};
