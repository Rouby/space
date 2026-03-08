import { and, eq, players, sql, turnReports } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.ts";
export const Game: Pick<
	GameResolvers,
	| "autoEndTurnAfterHoursInactive"
	| "autoEndTurnEveryHours"
	| "id"
	| "me"
	| "name"
	| "players"
	| "startedAt"
	| "turnNumber"
	| "turnReports"
	| "__isTypeOf"
> = {
	players: async (parent, _args, ctx) => {
		return ctx.drizzle.query.players.findMany({
			where: eq(players.gameId, parent.id),
			with: { user: true },
		});
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
	autoEndTurnAfterHoursInactive: async (_parent, _arg, _ctx) => {
		return _parent.autoEndTurnAfterHoursInactive;
	},
	autoEndTurnEveryHours: async (_parent, _arg, _ctx) => {
		return _parent.autoEndTurnEveryHours;
	},
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		return _parent.name;
	},
	startedAt: async (_parent, _arg, _ctx) => {
		return _parent.startedAt;
	},
	turnNumber: async (_parent, _arg, _ctx) => {
		return _parent.turnNumber;
	},
	turnReports: async (parent, args, ctx) => {
		const limit = Math.max(1, Math.min(args.limit ?? 20, 100));

		return ctx.drizzle
			.select()
			.from(turnReports)
			.where(eq(turnReports.gameId, parent.id))
			.orderBy(sql`${turnReports.turnNumber} desc`)
			.limit(limit);
	},
};
