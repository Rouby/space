import { eq, taskForces } from "@space/data/schema";
import { pipe } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { PubSubPublishArgsByKey } from "../../../../pubSub.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const trackTaskForces: NonNullable<
	SubscriptionResolvers["trackTaskForces"]
> = {
	subscribe: async (_parent, _arg, ctx) => {
		return pipe(ctx.pubSub.subscribe("taskForce:position"));
	},
	resolve: async (
		input: PubSubPublishArgsByKey["taskForce:position"][0],
		_arg: unknown,
		ctx: Context,
	) =>
		ctx.drizzle.query.taskForces
			.findFirst({
				where: eq(taskForces.id, input.id),
			})
			.then((taskForce) => {
				if (!taskForce) {
					throw new Error("TaskForce not found");
				}
				return taskForce;
			}),
};
