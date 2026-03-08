import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { filter } from "rxjs";
import type { Context } from "../../../../context.js";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import { fromGameEvents } from "../../../../workers.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const trackGame: NonNullable<SubscriptionResolvers["trackGame"]> = {
	subscribe: async (_parent, { gameId }, ctx) => {
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		const player = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.gameId, gameId),
				eq(players.userId, context.userId),
			),
		});

		if (!player) {
			context.denyAccess({
				message: "Not authorized to track this game",
				code: "NOT_AUTHORIZED",
				reason: "track-game-not-member",
				details: { gameId },
			});
		}

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
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		const player = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.gameId, event.gameId),
				eq(players.userId, context.userId),
			),
		});

		if (!player) {
			context.denyAccess({
				message: "Not authorized to track this game",
				code: "NOT_AUTHORIZED",
				reason: "track-game-event-not-member",
				details: { gameId: event.gameId },
			});
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, event.gameId),
		});

		if (!game) {
			throw new Error("Game not found for trackGame event");
		}

		switch (event.type) {
			case "game:newTurnCalculated":
				return {
					__typename: "NewTurnCalculatedEvent" as const,
					game,
				};
			case "game:turnEnded":
				return {
					__typename: "TurnEndedEvent" as const,
					game,
				};
			default:
				throw createGraphQLError("Unsupported game event received", {
					extensions: {
						code: "INVALID_GAME_EVENT",
						eventType: event.type,
					},
				});
		}
	},
};
