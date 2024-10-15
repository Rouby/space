import { eq, taskForceShipCommisionResourceNeeds } from "@space/data/schema";
import type { TaskForceShipCommisionResolvers } from "./../../types.generated.js";
export const TaskForceShipCommision: TaskForceShipCommisionResolvers = {
	/* Implement TaskForceShipCommision resolver logic here */
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		return _parent.name;
	},
	progress: async (_parent, _arg, _ctx) => {
		return +_parent.progress;
	},
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
	role: async (_parent, _arg, _ctx) => {
		return _parent.role;
	},
};
