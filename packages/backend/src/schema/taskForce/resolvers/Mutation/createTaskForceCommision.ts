import { eq, starSystems, taskForceCommisions } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createTaskForceCommision: NonNullable<
	MutationResolvers["createTaskForceCommision"]
> = async (_parent, { starSystemId }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const starSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, starSystemId),
	});

	if (!starSystem) {
		throw createGraphQLError("Star system not found");
	}

	const commision = await ctx.drizzle
		.insert(taskForceCommisions)
		.values({
			gameId: starSystem.gameId,
			starSystemId,
			total: 30,
		})
		.returning();

	return commision[0];
};
