import { filter, pipe } from "graphql-yoga";
import type {
	SubscriptionResolvers,
	TaskForceCommision,
} from "./../../../types.generated.js";
export const taskForceCommisionProgress: NonNullable<
	SubscriptionResolvers["taskForceCommisionProgress"]
> = {
	subscribe: async (_parent, arg, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		return pipe(
			ctx.pubSub.subscribe("taskForceCommisionProgress"),
			filter((input) => input.id === arg.id),
		);
	},
	resolve: (input: TaskForceCommision) => input,
};
