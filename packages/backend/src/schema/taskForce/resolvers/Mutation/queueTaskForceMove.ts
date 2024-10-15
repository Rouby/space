import {
	and,
	eq,
	notExists,
	taskForceEngagementsToTaskForces,
	taskForceShipCommisions,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { randomUUID } from "node:crypto";
import type { MutationResolvers } from "./../../../types.generated.js";
export const queueTaskForceMove: NonNullable<
	MutationResolvers["queueTaskForceMove"]
> = async (_parent, { id, position }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.id, id),
			// and not currently engaged in combat
			notExists(
				ctx.drizzle
					.select()
					.from(taskForceEngagementsToTaskForces)
					.where(eq(taskForceEngagementsToTaskForces.taskForceId, id)),
			),
			// and not currently building ships
			notExists(
				ctx.drizzle
					.select()
					.from(taskForceShipCommisions)
					.where(eq(taskForceShipCommisions.taskForceId, id)),
			),
		),
	});

	if (!taskForce) {
		throw createGraphQLError("Task force not found");
	}

	const updated = await ctx.drizzle
		.update(taskForces)
		.set({
			orders: [
				...taskForce.orders,
				{ id: randomUUID(), type: "move", destination: position },
			],
		})
		.where(eq(taskForces.id, id))
		.returning();

	return updated[0];
};
