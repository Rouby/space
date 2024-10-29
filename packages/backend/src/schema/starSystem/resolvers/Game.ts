import {
	and,
	eq,
	getLastKnownHelper,
	lastKnownStates,
	sql,
	starSystems,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: async (parent, _args, ctx) => {
		const { VisibilityQuery, visibilityExists, possiblyHidden } =
			getLastKnownHelper({
				tx: ctx.drizzle,
				gameId: parent.id,
				userId: ctx.userId ?? "",
				position: starSystems.position,
			});

		return ctx.drizzle
			.with(VisibilityQuery)
			.select({
				id: starSystems.id,
				name: starSystems.name,
				gameId: starSystems.gameId,
				position: starSystems.position,

				discoverySlots: possiblyHidden(starSystems.discoverySlots).as(
					"discoverySlots",
				),
				discoveryProgress: possiblyHidden(starSystems.discoveryProgress).as(
					"discoveryProgress",
				),
				ownerId: possiblyHidden(starSystems.ownerId).as("ownerId"),

				isVisible:
					sql<boolean>`CASE WHEN ${visibilityExists} THEN TRUE ELSE FALSE END`.as(
						"isVisible",
					),
				lastUpdate:
					sql<Date>`CASE WHEN ${visibilityExists} THEN NULL ELSE ${lastKnownStates.lastUpdate} END`
						.mapWith(lastKnownStates.lastUpdate)
						.as("lastUpdate"),
			})
			.from(starSystems)
			.where(and(eq(starSystems.gameId, parent.id)))
			.leftJoin(
				lastKnownStates,
				and(
					eq(lastKnownStates.gameId, parent.id),
					eq(lastKnownStates.subjectId, starSystems.id),
				),
			);
	},
};
