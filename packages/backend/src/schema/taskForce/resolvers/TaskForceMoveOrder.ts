import type { TaskForceMoveOrderResolvers } from "./../../types.generated.js";
export const TaskForceMoveOrder: TaskForceMoveOrderResolvers = {
	__isTypeOf: (obj) => {
		return obj.type === "move";
	},
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	destination: async (_parent, _arg, _ctx) => {
		return _parent.destination;
	},
};
