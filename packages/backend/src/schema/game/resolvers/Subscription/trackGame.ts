import { eq, games } from "@space/data/schema";
import { filter } from "rxjs";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import { fromGameEvents } from "../../../../workers.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const trackGame: NonNullable<SubscriptionResolvers["trackGame"]> = {
	subscribe: async (_parent, { gameId }, _ctx) => {
		return toAsyncIterable(
			fromGameEvents(gameId).pipe(
				filter(
					(event) =>
						event.type === "game:turnEnded" ||
						event.type === "game:newTurnCalculated",
				),
			),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: worker payload is not a GraphQL parent type yet.
	resolve: async (event: any, _args: any, ctx: any) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, event.gameId),
		});

		if (!game) {
			throw new Error("Game not found for trackGame event");
		}

		if (event.type === "game:newTurnCalculated") {
			return {
				__typename: "NewTurnCalculatedEvent" as const,
				game,
			};
		}

		return {
			__typename: "TurnEndedEvent" as const,
			game,
		};
	},
};
