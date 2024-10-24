import { and, eq, players } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated";
export const Game: Pick<
	GameResolvers,
	"id" | "me" | "name" | "players" | "startedAt" | "tickRate" | "__isTypeOf"
> = {
	players: async (parent, _args, ctx) => {
		return ctx.drizzle.query.players.findMany({
			where: eq(players.gameId, parent.id),
			with: { user: true },
		});
	},
	id: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.name;
	},
	startedAt: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.startedAt;
	},
	tickRate: async (_parent, _arg, _ctx) => {
		return _parent.tickRate;
	},
	me: async (parent, _args, ctx) => {
		const player = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.gameId, parent.id),
				eq(players.userId, ctx.userId ?? ""),
			),
			with: { user: true },
		});

		if (!player) {
			return null;
		}

		return player;
	},
};
