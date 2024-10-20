import { eq, shipDesignResourceCosts } from "@space/data/schema";
import type { ShipDesignResolvers } from "./../../types.generated.js";
export const ShipDesign: ShipDesignResolvers = {
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	armorRating: async (_parent, _arg, _ctx) => {
		return +_parent.armorRating;
	},
	decommissioned: async (_parent, _arg, _ctx) => {
		return _parent.decommissioned;
	},
	description: async (_parent, _arg, _ctx) => {
		return _parent.description;
	},
	hullRating: async (_parent, _arg, _ctx) => {
		return +_parent.hullRating;
	},
	name: async (_parent, _arg, _ctx) => {
		return _parent.name;
	},
	shieldRating: async (_parent, _arg, _ctx) => {
		return +_parent.shieldRating;
	},
	speedRating: async (_parent, _arg, _ctx) => {
		return +_parent.speedRating;
	},
	supplyCapacity: async (_parent, _arg, _ctx) => {
		return +_parent.supplyCapacity;
	},
	supplyNeed: async (_parent, _arg, _ctx) => {
		return +_parent.supplyNeed;
	},
	weaponRating: async (_parent, _arg, _ctx) => {
		return +_parent.weaponRating;
	},
	zoneOfControlRating: async (_parent, _arg, _ctx) => {
		return +_parent.zoneOfControlRating;
	},
	sensorRating: async (_parent, _arg, _ctx) => {
		return +_parent.zoneOfControlRating;
	},
	costs: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesignResourceCosts)
			.where(eq(shipDesignResourceCosts.shipDesignId, parent.id));
	},
};
