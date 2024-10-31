import { eq, taskForceEngagements } from "@space/data/schema";
import type { QueryResolvers } from "./../../../types.generated.js";
export const taskForceEngagement: NonNullable<
	QueryResolvers["taskForceEngagement"]
> = async (parent, { id }, ctx) => {
	return ctx.drizzle
		.select()
		.from(taskForceEngagements)
		.where(eq(taskForceEngagements.id, id))
		.then((results) => results[0]);
};
