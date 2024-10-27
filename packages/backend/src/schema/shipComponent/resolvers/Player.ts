import { and, eq, shipComponents } from "@space/data/schema";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<PlayerResolvers, "shipComponents" | "__isTypeOf"> = {
	/* Implement Player resolver logic here */
	shipComponents: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipComponents)
			.where(
				and(
					eq(shipComponents.ownerId, parent.userId),
					eq(shipComponents.gameId, parent.gameId),
				),
			);
	},
};
