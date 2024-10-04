import { eq, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { randomUUID } from "node:crypto";
import type { MutationResolvers } from "./../../../types.generated.js";
export const moveTaskForce: NonNullable<
	MutationResolvers["moveTaskForce"]
> = async (_parent, { id, position }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: eq(taskForces.id, id),
	});

	if (!taskForce) {
		throw createGraphQLError("Task force not found");
	}

	const updated = await ctx.drizzle
		.update(taskForces)
		.set({
			orders: [{ id: randomUUID(), type: "move", destination: position }],
		})
		.where(eq(taskForces.id, id))
		.returning();

	return updated[0];
};
