import { filter } from "rxjs";
import { toAsyncIterable } from "../../../../toAsyncIterable.js";
import { fromGameEvents } from "../../../../workers.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const trackGame: NonNullable<SubscriptionResolvers["trackGame"]> = {
	subscribe: async (_parent, { gameId }, _ctx) => {
		return toAsyncIterable(
			fromGameEvents(gameId).pipe(
				filter((event) => event.type === "game:turnEnded"),
			),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: can be any
	resolve: (input: any) => input,
};
