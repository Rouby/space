import { eq, shipDesigns } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "shipDesigns" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	shipDesigns: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesigns)
			.where(eq(shipDesigns.gameId, parent.id));
	},
};
