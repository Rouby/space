import { filter, pipe } from "graphql-yoga";
import type { TaskForceCommisionFinishedMapper } from "../../schema.mappers.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const taskForceCommisionFinished: NonNullable<
	SubscriptionResolvers["taskForceCommisionFinished"]
> = {
	subscribe: async (_parent, arg, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		return pipe(
			ctx.pubSub.subscribe("taskForceCommisionCompleted"),
			filter((input) => input.id === arg.id),
		);
	},
	resolve: (input: TaskForceCommisionFinishedMapper) => input,
};
