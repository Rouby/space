import { eq, taskForceShipCommisions } from "@space/data/schema";
import type { QueryResolvers } from "./../../../types.generated.js";
export const taskForceShipCommision: NonNullable<
	QueryResolvers["taskForceShipCommision"]
> = async (_parent, { id }, ctx) => {
	return ctx.drizzle
		.select()
		.from(taskForceShipCommisions)
		.where(eq(taskForceShipCommisions.taskForceId, id))
		.then((res) => res[0]);
};
