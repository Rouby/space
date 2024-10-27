import { eq, taskForceShipCommisionResourceNeeds } from "@space/data/schema";
import type { TaskForceShipCommisionResolvers } from "./../../types.generated.js";
export const TaskForceShipCommision: TaskForceShipCommisionResolvers = {
	/* Implement TaskForceShipCommision resolver logic here */
	resourceNeeds: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForceShipCommisionResourceNeeds)
			.where(
				eq(
					taskForceShipCommisionResourceNeeds.taskForceShipCommisionId,
					parent.id,
				),
			);
	},
	shipDesign: async (_parent, _arg, _ctx) => {
		/* TaskForceShipCommision.shipDesign resolver is required because TaskForceShipCommision.shipDesign exists but TaskForceShipCommisionMapper.shipDesign does not */
	},
};
