import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const taskForceCommisionFinished: NonNullable<
	SubscriptionResolvers["taskForceCommisionFinished"]
> = {
	subscribe: async (_parent, arg, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		return toAsyncIterable(ctx.fromGameEvents("taskForce:commisionFinished"));
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
