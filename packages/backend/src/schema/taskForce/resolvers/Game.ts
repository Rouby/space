import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		const tfs = await ctx.drizzle.query.taskForces.findMany({});

		return tfs;
	},
};
