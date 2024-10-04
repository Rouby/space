import type { TaskForceMoveOrderResolvers } from "./../../types.generated.js";
export const TaskForceMoveOrder: TaskForceMoveOrderResolvers = {
	__isTypeOf: (obj) => {
		return obj.type === "move";
	},
};
