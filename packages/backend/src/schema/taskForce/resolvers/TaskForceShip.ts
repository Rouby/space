import {
	eq,
	getTableColumns,
	shipComponents,
	shipDesignComponents,
	shipDesigns,
} from "@space/data/schema";
import type { TaskForceShipResolvers } from "./../../types.generated.js";
export const TaskForceShip: TaskForceShipResolvers = {
	/* Implement TaskForceShip resolver logic here */
	supplyCarried: async (_parent, _arg, _ctx) => {
		return +_parent.supplyCarried;
	},
	shipDesign: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesigns)
			.where(eq(shipDesigns.id, parent.shipDesignId))
			.then((results) => results[0]);
	},
	components: async (parent, _arg, ctx) => {
		return await ctx.drizzle
			.select({
				...getTableColumns(shipComponents),
				position: shipDesignComponents.position,
			})
			.from(shipComponents)
			.innerJoin(
				shipDesignComponents,
				eq(shipDesignComponents.shipComponentId, shipComponents.id),
			)
			.where(eq(shipDesignComponents.shipDesignId, parent.shipDesignId))
			.then((components) =>
				components.map((component) => ({
					id: `${component.id}-${component.position}`,
					component,
					state: +parent.componentStates[component.position],
				})),
			);
	},
	structuralIntegrity: ({ structuralIntegrity }, _arg, _ctx) => {
		/* TaskForceShip.structuralIntegrity resolver is required because TaskForceShip.structuralIntegrity and TaskForceShipMapper.structuralIntegrity are not compatible */
		return +structuralIntegrity;
	},
};
