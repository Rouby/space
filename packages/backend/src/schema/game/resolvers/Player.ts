import {
	and,
	eq,
	games,
	lte,
	playerResearchDirectives,
	playerResearchOutcomes,
	playerResearchStates,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<
	PlayerResolvers,
	| "color"
	| "currentResearchDirective"
	| "id"
	| "name"
	| "researchOutcomes"
	| "researchStates"
	| "turnEnded"
	| "user"
> = {
	id: async (parent, _arg, _ctx) => {
		return `${parent.gameId}-${parent.userId}`;
	},
	color: async (_parent, _arg, _ctx) => {
		return _parent.color;
	},
	name: async (parent, _arg, _ctx) => {
		return parent.user.name;
	},
	user: async (_parent, _arg, _ctx) => {
		return _parent.user;
	},
	turnEnded: async (_parent, _arg, _ctx) => {
		return !!_parent.turnEndedAt;
	},
	currentResearchDirective: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		return ctx.drizzle.query.playerResearchDirectives.findFirst({
			where: and(
				eq(playerResearchDirectives.gameId, parent.gameId),
				eq(playerResearchDirectives.playerId, parent.userId),
				lte(playerResearchDirectives.turnNumber, game.turnNumber),
			),
			orderBy: [desc(playerResearchDirectives.turnNumber)],
		});
	},
	researchStates: async (parent, _arg, ctx) => {
		return ctx.drizzle.query.playerResearchStates.findMany({
			where: and(
				eq(playerResearchStates.gameId, parent.gameId),
				eq(playerResearchStates.playerId, parent.userId),
			),
		});
	},
	researchOutcomes: async (parent, { limit }, ctx) => {
		const maxLimit = Math.min(Math.max(limit ?? 20, 1), 100);
		return ctx.drizzle.query.playerResearchOutcomes.findMany({
			where: and(
				eq(playerResearchOutcomes.gameId, parent.gameId),
				eq(playerResearchOutcomes.playerId, parent.userId),
			),
			orderBy: (outcomes, { desc }) => [desc(outcomes.turnNumber)],
			limit: maxLimit,
		});
	},
};
