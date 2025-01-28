import {
	eq,
	shipComponentResourceCosts,
	shipComponents,
	shipDesignComponents,
} from "@space/data/schema";
import type { ShipDesignResolvers } from "./../../types.generated.js";
export const ShipDesign: ShipDesignResolvers = {
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		return _parent.name;
	},
	description: async (_parent, _arg, _ctx) => {
		return _parent.description;
	},
	decommissioned: async (_parent, _arg, _ctx) => {
		return _parent.decommissioned;
	},
	costs: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select({
				resourceId: shipComponentResourceCosts.resourceId,
				quantity: shipComponentResourceCosts.quantity,
			})
			.from(shipDesignComponents)
			.where(eq(shipDesignComponents.shipDesignId, parent.id))
			.innerJoin(
				shipComponentResourceCosts,
				eq(
					shipComponentResourceCosts.shipComponentId,
					shipDesignComponents.shipComponentId,
				),
			);
	},
	components: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesignComponents)
			.innerJoin(
				shipComponents,
				eq(shipComponents.id, shipDesignComponents.shipComponentId),
			)
			.where(eq(shipDesignComponents.shipDesignId, parent.id))
			.then((rows) =>
				rows.map((row) => ({
					id: row.shipDesignComponents.shipComponentId,
					component: row.shipComponents,
					position: row.shipDesignComponents.position,
				})),
			);
	},
};
