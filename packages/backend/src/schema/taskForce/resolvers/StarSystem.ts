import {
	and,
	eq,
	sql,
	taskForceShipCommisions,
	taskForces,
} from "@space/data/schema";
import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: Pick<
	StarSystemResolvers,
	"taskForceShipCommisions" | "taskForces" | "__isTypeOf"
> = {
	taskForces: async (parent, _arg, ctx) => {
		const tfs = await ctx.drizzle.query.taskForces.findMany({
			where: sql`${taskForces.position} <-> point(${parent.position.x}, ${parent.position.y}) < 10`,
		});

		return tfs;
	},
	taskForceShipCommisions: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForceShipCommisions)
			.where(
				and(
					eq(taskForceShipCommisions.gameId, parent.gameId),
					eq(taskForceShipCommisions.starSystemId, parent.id),
				),
			);
	},
};
