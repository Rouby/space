import { and, eq, games, players, starSystems } from "@space/data/schema";
import type { StarSystemColonizationResolvers } from "./../../types.generated.js";

export const StarSystemColonization: StarSystemColonizationResolvers = {
	player: async (parent, _arg, ctx) => {
		const player = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.gameId, parent.gameId),
				eq(players.userId, parent.playerId),
			),
			with: { user: true },
		});

		if (!player) {
			throw new Error("Colonization player not found");
		}

		return player;
	},
	originStarSystem: async (parent, _arg, ctx) => {
		const starSystem = await ctx.drizzle.query.starSystems.findFirst({
			where: eq(starSystems.id, parent.originStarSystemId),
		});

		if (!starSystem) {
			throw new Error("Origin star system not found");
		}

		return { ...starSystem, isVisible: true, lastUpdate: null };
	},
	turnsRemaining: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return 0;
		}

		return Math.max(parent.dueTurn - game.turnNumber, 0);
	},
};
