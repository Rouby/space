import {
	and,
	eq,
	games,
	players,
	taskForceShipCommisions,
	taskForceShips,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
export const TaskForce: TaskForceResolvers = {
	owner: async (parent, _arg, ctx) => {
		if (!parent.ownerId) {
			return null;
		}

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
	ships: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForceShips)
			.where(and(eq(taskForceShips.taskForceId, parent.id)));
	},
	commisions: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForceShipCommisions)
			.where(and(eq(taskForceShips.taskForceId, parent.id)));
	},
};
