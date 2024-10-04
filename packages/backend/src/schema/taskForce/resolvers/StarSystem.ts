import { eq, sql, taskForceCommisions, taskForces } from "@space/data/schema";
import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: Pick<
	StarSystemResolvers,
	"taskForceCommisions" | "taskForces" | "__isTypeOf"
> = {
	taskForceCommisions: async (parent, _arg, ctx) => {
		return ctx.drizzle.query.taskForceCommisions.findMany({
			where: eq(taskForceCommisions.starSystemId, parent.id),
		});
	},
	taskForces: async (parent, _arg, ctx) => {
		const tfs = await ctx.drizzle.query.taskForces.findMany({
			where: sql`${taskForces.position} <-> point(${parent.position.x}, ${parent.position.y}) < 10`,
		});

		return tfs;
	},
};
