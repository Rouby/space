import {
	and,
	eq,
	exists,
	sql,
	taskForces,
	visibility,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForces)
			.where(
				and(
					eq(taskForces.gameId, parent.id),
					exists(
						ctx.drizzle
							.select({ circle: visibility.circle })
							.from(visibility)
							.where(
								and(
									eq(visibility.gameId, taskForces.gameId),
									eq(visibility.userId, ctx.userId ?? ""),
									sql`${visibility.circle} @> ${taskForces.position}`,
								),
							),
					),
				),
			);
	},
};
