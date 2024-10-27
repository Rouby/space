import { eq, shipComponents } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "shipComponents" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	shipComponents: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipComponents)
			.where(eq(shipComponents.gameId, parent.id));
	},
};
