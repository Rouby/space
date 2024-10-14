import { eq, resources } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { ResourceCostResolvers } from "./../../types.generated.js";
export const ResourceCost: ResourceCostResolvers = {
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
