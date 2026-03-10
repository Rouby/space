import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
export const TaskForce: TaskForceResolvers = {
	name: (parent) => {
		return parent.name ?? "Unknown";
	},
	sensorRange: () => 250,
	combatDeck: (parent) => parent.combatDeck ?? [],
	constructionDone: (parent) =>
		parent.constructionDone !== null && parent.constructionDone !== undefined
			? Number(parent.constructionDone)
			: null,
	constructionTotal: (parent) =>
		parent.constructionTotal !== null && parent.constructionTotal !== undefined
			? Number(parent.constructionTotal)
			: null,
	constructionPerTick: (parent) =>
		parent.constructionPerTick !== null &&
		parent.constructionPerTick !== undefined
			? Number(parent.constructionPerTick)
			: null,
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
};
