import type { TaskForceFollowOrderResolvers } from "./../../types.generated.js";
export const TaskForceFollowOrder: TaskForceFollowOrderResolvers = {
	__isTypeOf: (obj) => {
		return obj.type === "follow";
	},
	taskForce: async (_parent, _arg, _ctx) => {
		/* TaskForceFollowOrder.taskForce resolver is required because TaskForceFollowOrder.taskForce exists but TaskForceFollowOrderMapper.taskForce does not */
	},
};
