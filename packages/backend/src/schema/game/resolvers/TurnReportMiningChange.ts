import { eq, resources, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TurnReportMiningChangeResolvers } from "./../../types.generated.ts";

export const TurnReportMiningChange: TurnReportMiningChangeResolvers = {
	depotQuantity: async (parent, _arg, _ctx) => {
		return parent.depotQuantity;
	},
	mined: async (parent, _arg, _ctx) => {
		return parent.mined;
	},
	remainingDeposits: async (parent, _arg, _ctx) => {
		return parent.remainingDeposits;
	},
	resource: async (parent, _arg, ctx) => {
		const resource = await ctx.drizzle.query.resources.findFirst({
			where: eq(resources.id, parent.resourceId),
		});

		if (!resource) {
			throw createGraphQLError("Resource not found");
		}

		return resource;
	},
	starSystem: async (parent, _arg, ctx) => {
		const starSystem = await ctx.drizzle.query.starSystems.findFirst({
			where: eq(starSystems.id, parent.starSystemId),
		});

		if (!starSystem) {
			throw createGraphQLError("Star system not found");
		}

		return {
			...starSystem,
			isVisible: true,
			lastUpdate: null,
		};
	},
};
