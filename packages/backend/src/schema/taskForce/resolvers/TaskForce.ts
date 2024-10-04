import { eq, users } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
export const TaskForce: TaskForceResolvers = {
	/* Implement TaskForce resolver logic here */
	id: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.name;
	},
	position: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.position;
	},
	orders: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.orders;
	},
	owner: async (parent, _arg, ctx) => {
		const owner = await ctx.drizzle.query.users.findFirst({
			where: eq(users.id, parent.ownerId),
		});

		if (!owner) {
			throw createGraphQLError("Owner not found");
		}

		return owner;
	},
};
