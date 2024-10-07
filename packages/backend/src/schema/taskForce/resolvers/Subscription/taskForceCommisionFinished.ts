import { filter, pipe } from "graphql-yoga";
import type { PubSubPublishArgsByKey } from "../../../../pubSub.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const taskForceCommisionFinished: NonNullable<
	SubscriptionResolvers["taskForceCommisionFinished"]
> = {
	subscribe: async (_parent, arg, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		return pipe(
			ctx.pubSub.subscribe("taskForce:commisionFinished"),
			filter((input) => input.id === arg.id),
		);
	},
	resolve: (input: PubSubPublishArgsByKey["taskForce:commisionFinished"][0]) =>
		input,
};
