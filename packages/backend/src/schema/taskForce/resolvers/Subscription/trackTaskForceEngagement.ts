import { and, eq, or, taskForceEngagements } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { filter, map } from "rxjs";
import type { Context } from "../../../../context.js";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import { fromGameEvents } from "../../../../workers.ts";
import type { SubscriptionResolvers } from "../../../types.generated.js";

export const trackTaskForceEngagement: NonNullable<
	SubscriptionResolvers["trackTaskForceEngagement"]
> = {
	subscribe: async (_parent, { engagementId }, ctx) => {
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		const engagement = await ctx.drizzle.query.taskForceEngagements.findFirst({
			where: and(
				eq(taskForceEngagements.id, engagementId),
				or(
					eq(taskForceEngagements.ownerIdA, context.userId),
					eq(taskForceEngagements.ownerIdB, context.userId),
				),
			),
		});

		if (!engagement) {
			return context.denyAccess({
				message: "Not authorized to track this engagement",
				code: "NOT_AUTHORIZED",
				reason: "track-engagement-not-participant",
				details: { engagementId },
			});
		}

		return toAsyncIterable(
			fromGameEvents(engagement.gameId).pipe(
				filter(
					(event) =>
						event.type === "taskForceEngagement:roundSubmitted" ||
						event.type === "taskForceEngagement:roundResolved" ||
						event.type === "taskForceEngagement:weaponFired" ||
						event.type === "taskForceEngagement:ended",
				),
				filter((event) => event.id === engagementId),
				map(() => ({ id: engagementId })),
			),
		);
	},
	resolve: async (event: { id: string }, _args: unknown, ctx: Context) => {
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		const engagement = await ctx.drizzle.query.taskForceEngagements.findFirst({
			where: and(
				eq(taskForceEngagements.id, event.id),
				or(
					eq(taskForceEngagements.ownerIdA, context.userId),
					eq(taskForceEngagements.ownerIdB, context.userId),
				),
			),
		});

		if (!engagement) {
			throw createGraphQLError("Engagement not found", {
				extensions: { code: "NOT_FOUND" },
			});
		}

		return engagement;
	},
};
