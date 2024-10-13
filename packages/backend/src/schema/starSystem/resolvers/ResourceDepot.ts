import { eq, resources } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { ResourceDepotResolvers } from "./../../types.generated.js";
export const ResourceDepot: ResourceDepotResolvers = {
	/* Implement ResourceDepot resolver logic here */
	id: async (parent, _arg, _ctx) => {
		return `${parent.starSystemId}-${parent.resourceId}`;
	},
	quantity: async (_parent, _arg, _ctx) => {
		return +_parent.quantity;
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
};
