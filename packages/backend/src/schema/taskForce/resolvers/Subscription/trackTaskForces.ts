import { eq, taskForces } from "@space/data/schema";
import { pipe } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { TaskForceMapper } from "../../schema.mappers.js";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
export const trackTaskForces: NonNullable<
	SubscriptionResolvers["trackTaskForces"]
> = {
	subscribe: async (_parent, _arg, ctx) => {
		return pipe(ctx.pubSub.subscribe("taskForceMovement"));
	},
	resolve: async (input: TaskForceMapper, _arg: unknown, ctx: Context) =>
		ctx.drizzle.query.taskForces.findFirst({
			where: eq(taskForces.id, input.id),
		}),
};
