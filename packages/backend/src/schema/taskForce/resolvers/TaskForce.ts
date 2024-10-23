import {
	and,
	eq,
	games,
	players,
	taskForceShipCommisions,
	taskForceShips,
	taskForceShipsWithStats,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
export const TaskForce: TaskForceResolvers = {
	name: (parent) => {
		return parent.name ?? "Unknown";
	},
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
	sensorRange: async (parent, _arg, ctx) => {
		const ships = await ctx.drizzle
			.select()
			.from(taskForceShipsWithStats)
			.where(eq(taskForceShipsWithStats.taskForceId, parent.id));

		return ships.reduce((acc, ship) => {
			return Math.max(acc, +ship.sensor);
		}, 0);
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
