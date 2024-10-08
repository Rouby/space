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
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: async (parent, _args, ctx) => {
		const controlledTaskForces = aliasedTable(
			taskForces,
			"controlledTaskForces",
		);
		const controlledSystems = aliasedTable(starSystems, "controlledSystems");

		return ctx.drizzle
			.select()
			.from(starSystems)
			.where(
				and(
					eq(starSystems.gameId, parent.id),
					or(
						// either the star system is owned by the player
						eq(starSystems.ownerId, ctx.userId ?? ""),
						// or the star system is close to a task force the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledTaskForces)
								.where(
									and(
										eq(controlledTaskForces.gameId, parent.id),
										eq(controlledTaskForces.ownerId, ctx.userId ?? ""),
										sql`${controlledTaskForces.position} <-> ${starSystems.position} < 100`,
									),
								),
						),
						// or the star system is close to a star system the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledSystems)
								.where(
									and(
										eq(controlledSystems.gameId, parent.id),
										eq(controlledSystems.ownerId, ctx.userId ?? ""),
										sql`${controlledSystems.position} <-> ${starSystems.position} < 1000`,
									),
								),
						),
					),
				),
			);
	},
};
