import { filter, pipe } from "graphql-yoga";
import type { PubSubPublishArgsByKey } from "../../../../pubSub.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const taskForceCommisionProgress: NonNullable<
	SubscriptionResolvers["taskForceCommisionProgress"]
> = {
	subscribe: async (_parent, arg, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		return pipe(
			ctx.pubSub.subscribe("taskForce:commisionProgress"),
			filter((input) => input.id === arg.id),
		);
	},
	resolve: (input: PubSubPublishArgsByKey["taskForce:commisionProgress"][0]) =>
		input,
};
