import { and, eq, or, taskForceEngagements } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "../../../types.generated.js";

export const taskForceEngagement: NonNullable<
	QueryResolvers["taskForceEngagement"]
> = async (_parent, { id }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const engagement = await ctx.drizzle.query.taskForceEngagements.findFirst({
		where: eq(taskForceEngagements.id, id),
	});

	if (!engagement) {
		throw createGraphQLError("Engagement not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const participant = await ctx.drizzle.query.taskForceEngagements.findFirst({
		where: and(
			eq(taskForceEngagements.id, id),
			or(
				eq(taskForceEngagements.ownerIdA, context.userId),
				eq(taskForceEngagements.ownerIdB, context.userId),
			),
		),
	});

	if (!participant) {
		return context.denyAccess({
			message: "Not authorized to access this engagement",
			code: "NOT_AUTHORIZED",
			reason: "task-force-engagement-not-participant",
			details: { engagementId: id },
		});
	}

	return engagement;
};
