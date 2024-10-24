import {
	and,
	eq,
	lastKnownStates,
	possiblyHidden,
	sql,
	starSystems,
	visibility,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: async (parent, _args, ctx) => {
		return ctx.drizzle
			.select({
				id: starSystems.id,
				name: starSystems.name,
				gameId: starSystems.gameId,
				position: starSystems.position,
				discoverySlots: starSystems.discoverySlots,
				ownerId: possiblyHidden(starSystems.ownerId).as("ownerId"),
				isVisible: sql<boolean>`CASE WHEN ${visibility.circle} IS NOT NULL THEN TRUE ELSE FALSE END`,
				lastUpdate: sql<Date>`CASE WHEN ${visibility.circle} IS NULL THEN ${lastKnownStates.lastUpdate} ELSE NULL END`,
			})
			.from(starSystems)
			.where(eq(starSystems.gameId, parent.id))
			.leftJoin(
				visibility,
				and(
					eq(visibility.gameId, starSystems.gameId),
					eq(visibility.userId, ctx.userId ?? ""),
					sql`${visibility.circle} @> ${starSystems.position}`,
				),
			)
			.leftJoin(
				lastKnownStates,
				and(
					eq(lastKnownStates.gameId, parent.id),
					eq(lastKnownStates.subjectId, starSystems.id),
				),
			);
	},
};
