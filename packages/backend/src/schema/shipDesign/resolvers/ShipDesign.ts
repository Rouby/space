import {
	eq,
	shipComponentResourceCosts,
	shipComponents,
	shipDesignComponents,
	shipDesignResourceCosts,
	shipDesigns,
	sql,
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
		const AllCosts = ctx.drizzle.$with("AllCosts").as((qb) =>
			qb
				.select({
					resourceId: shipDesignResourceCosts.resourceId,
					quantity: shipDesignResourceCosts.quantity,
				})
				.from(shipDesignResourceCosts)
				.where(eq(shipDesignResourceCosts.shipDesignId, parent.id))
				.unionAll(
					ctx.drizzle
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
						),
				),
		);

		return ctx.drizzle
			.with(AllCosts)
			.select({
				resourceId: AllCosts.resourceId,
				quantity: sql`sum(${AllCosts.quantity})`
					.mapWith(AllCosts.quantity)
					.as("quantity"),
			})
			.from(AllCosts)
			.groupBy(AllCosts.resourceId);
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
			.then((rows) => rows.map((row) => row.shipComponents));
	},
	previousDesign: async (parent, _arg, ctx) => {
		return parent.previousDesignId
			? ctx.drizzle
					.select()
					.from(shipDesigns)
					.where(eq(shipDesigns.id, parent.previousDesignId))
					.then((rows) => rows[0])
			: null;
	},
};
