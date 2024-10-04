import { eq, taskForces } from "@space/data/schema";
import type { TaskForceCommisionFinishedResolvers } from "./../../types.generated.js";
export const TaskForceCommisionFinished: TaskForceCommisionFinishedResolvers = {
	/* Implement TaskForceCommisionFinished resolver logic here */
	taskForce: async (parent, _arg, ctx) => {
		console.log(parent);
		return (
			(await ctx.drizzle.query.taskForces.findFirst({
				where: eq(taskForces.id, parent.taskForceId),
			})) ?? null
		);
	},
};
