import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
export const TaskForce: TaskForceResolvers = {
	/* Implement TaskForce resolver logic here */
	id: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.name;
	},
	position: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.position;
	},
	orders: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.orders;
	},
	movementVector: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.movementVector;
	},
	owner: async (parent, _arg, ctx) => {
		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, parent.ownerId),
				eq(players.gameId, parent.gameId),
			),
			with: { user: true },
		});

		if (!owner) {
			throw createGraphQLError("Owner not found");
		}

		return owner;
	},
	game: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
		});

		if (!game) {
			throw createGraphQLError("Game not found");
		}

		return game;
	},
	sensorRange: async (_parent, _arg, _ctx) => {
		return 100;
	},
};
