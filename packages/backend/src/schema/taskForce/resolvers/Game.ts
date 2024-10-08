import {
	aliasedTable,
	and,
	eq,
	exists,
	or,
	sql,
	starSystems,
	taskForces,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		const controlledSystems = aliasedTable(starSystems, "controlledSystems");
		const controlledTaskForces = aliasedTable(
			taskForces,
			"controlledTaskForces",
		);

		return ctx.drizzle
			.select()
			.from(taskForces)
			.where(
				and(
					eq(taskForces.gameId, parent.id),
					or(
						// either the task force is owned by the player
						eq(taskForces.ownerId, ctx.userId ?? ""),
						// or the star system is close to a task force the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledTaskForces)
								.where(
									and(
										eq(controlledTaskForces.gameId, parent.id),
										eq(controlledTaskForces.ownerId, ctx.userId ?? ""),
										sql`${controlledTaskForces.position} <-> ${taskForces.position} < 100`,
									),
								),
						),
						// or the task force is close to a star system the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledSystems)
								.where(
									and(
										eq(controlledSystems.gameId, parent.id),
										eq(controlledSystems.ownerId, ctx.userId ?? ""),
										sql`${controlledSystems.position} <-> ${taskForces.position} < 1000`,
									),
								),
						),
					),
				),
			);
	},
};
