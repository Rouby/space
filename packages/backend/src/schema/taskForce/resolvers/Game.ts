import { eq, taskForces } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		const tfs = await ctx.drizzle.query.taskForces.findMany({
			where: eq(taskForces.gameId, parent.id),
		});

		return tfs;
	},
};
