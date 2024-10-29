import { eq, shipDesigns } from "@space/data/schema";
import type { TaskForceShipResolvers } from "./../../types.generated.js";
export const TaskForceShip: TaskForceShipResolvers = {
	/* Implement TaskForceShip resolver logic here */
	supplyCarried: async (_parent, _arg, _ctx) => {
		return +_parent.supplyCarried;
	},
	shipDesign: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesigns)
			.where(eq(shipDesigns.id, parent.shipDesignId))
			.then((results) => results[0]);
	},
};
