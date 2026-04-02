import { and, eq, isNull, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const assignTaskForceMission: NonNullable<
	MutationResolvers["assignTaskForceMission"]
> = async (_parent, { taskForceId, mission }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const [updated] = await context.drizzle
		.update(taskForces)
		.set({ mission })
		.where(
			and(
				eq(taskForces.id, taskForceId),
				eq(taskForces.ownerId, context.userId),
				isNull(taskForces.deletedAt),
			),
		)
		.returning();

	if (!updated) {
		throw createGraphQLError(
			"Task force not found or you are not authorized to update it",
			{ extensions: { code: "NOT_FOUND" } },
		);
	}

	return { ...updated, isVisible: true, lastUpdate: null };
};
