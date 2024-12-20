import { eq, taskForceEngagements } from "@space/data/schema";
import { taskForceEngagement$ } from "../../../../observables/taskForceEngagement.ts";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.ts";
export const trackTaskForceEngagement: NonNullable<
	SubscriptionResolvers["trackTaskForceEngagement"]
> = {
	subscribe: async (_parent, { taskForceEngagementId }, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		const [{ gameId }] = await ctx.drizzle
			.select({ gameId: taskForceEngagements.gameId })
			.from(taskForceEngagements)
			.where(eq(taskForceEngagements.id, taskForceEngagementId));

		const taskForceEngagementEvents = taskForceEngagement$({
			userId: ctx.userId ?? "",
			gameId,
			taskForceEngagementId,
		});

		return toAsyncIterable(taskForceEngagementEvents);
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
