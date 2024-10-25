import type { TaskForceColonizeOrderResolvers } from "./../../types.generated.js";
export const TaskForceColonizeOrder: TaskForceColonizeOrderResolvers = {
	__isTypeOf: (obj) => {
		return obj.type === "colonize";
	},
};
