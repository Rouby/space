import {
	and,
	eq,
	exists,
	sql,
	starSystems,
	visibility,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: async (parent, _args, ctx) => {
		return ctx.drizzle
			.select()
			.from(starSystems)
			.where(
				and(
					eq(starSystems.gameId, parent.id),
					exists(
						ctx.drizzle
							.select({ circle: visibility.circle })
							.from(visibility)
							.where(
								and(
									eq(visibility.gameId, starSystems.gameId),
									eq(visibility.userId, ctx.userId ?? ""),
									sql`${visibility.circle} @> ${starSystems.position}`,
								),
							),
					),
				),
			);
	},
};
