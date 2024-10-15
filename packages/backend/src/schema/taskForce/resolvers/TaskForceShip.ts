import type { TaskForceShipResolvers } from "./../../types.generated.js";
export const TaskForceShip: TaskForceShipResolvers = {
	/* Implement TaskForceShip resolver logic here */

	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		return _parent.name;
	},
	role: async (_parent, _arg, _ctx) => {
		return _parent.role;
	},
	shieldState: async (_parent, _arg, _ctx) => {
		return +_parent.shieldState;
	},
	supplyCarried: async (_parent, _arg, _ctx) => {
		return +_parent.supplyCarried;
	},
	weaponState: async (_parent, _arg, _ctx) => {
		return +_parent.weaponState;
	},
	armorState: async (_parent, _arg, _ctx) => {
		return +_parent.armorState;
	},
	hullState: async (_parent, _arg, _ctx) => {
		return +_parent.hullState;
	},
};
