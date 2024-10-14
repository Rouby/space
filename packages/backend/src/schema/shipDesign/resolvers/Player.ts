import { and, eq, shipDesigns } from "@space/data/schema";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<PlayerResolvers, "shipDesigns" | "__isTypeOf"> = {
	/* Implement Player resolver logic here */
	shipDesigns: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesigns)
			.where(
				and(
					eq(shipDesigns.ownerId, parent.userId),
					eq(shipDesigns.gameId, parent.gameId),
				),
			);
	},
};
