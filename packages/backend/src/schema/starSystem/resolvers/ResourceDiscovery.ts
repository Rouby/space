import { eq, resources } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { ResourceDiscoveryResolvers } from "./../../types.generated.js";

const BASE_MINING_UNITS_PER_ROUND = 180;

export const ResourceDiscovery: ResourceDiscoveryResolvers = {
	/* Implement ResourceDiscovery resolver logic here */
	id: async (parent, _arg, _ctx) => {
		return `${parent.starSystemId}-${parent.resourceId}`;
	},
	remainingDeposits: async (_parent, _arg, _ctx) => {
		return +_parent.remainingDeposits;
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
	miningRate: async (parent, _arg, _ctx) => {
		const remainingDeposits = +parent.remainingDeposits;

		return Math.min(BASE_MINING_UNITS_PER_ROUND, remainingDeposits);
	},
};
