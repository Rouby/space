import { eq, resources } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "resources"> = {
	/* Implement Game resolver logic here */
	resources: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(resources)
			.where(eq(resources.gameId, parent.id));
	},
};
