import { eq, players } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated";
export const Game: Pick<
	GameResolvers,
	"id" | "me" | "name" | "players" | "startedAt" | "__isTypeOf"
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
	me: async (parent, _args, ctx) => {
		const player = await ctx.drizzle.query.players.findFirst({
			where: eq(players.gameId, parent.id),
			with: { user: true },
		});

		if (!player) {
			return null;
		}

		return player;
	},
};
