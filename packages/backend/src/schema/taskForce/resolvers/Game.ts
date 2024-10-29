import {
	and,
	eq,
	getLastKnownHelper,
	isNotNull,
	lastKnownStates,
	or,
	sql,
	taskForces,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		const {
			VisibilityQuery,
			visibilityExists,
			possiblyHidden,
			knownOrLastKnown,
		} = getLastKnownHelper({
			tx: ctx.drizzle,
			gameId: parent.id,
			userId: ctx.userId ?? "",
			position: taskForces.position,
		});

		return ctx.drizzle
			.with(VisibilityQuery)
			.select({
				id: sql<string>`CASE WHEN ${visibilityExists} THEN ${taskForces.id} ELSE ${lastKnownStates.subjectId} END`.as(
					"id",
				),
				gameId:
					sql<string>`CASE WHEN ${visibilityExists} THEN ${taskForces.gameId} ELSE ${lastKnownStates.gameId} END`.as(
						"gameId",
					),

				name: possiblyHidden(taskForces.name).as("name"),
				position: knownOrLastKnown(taskForces.position).as("position"),
				orders: possiblyHidden(taskForces.orders).as("orders"),
				movementVector: possiblyHidden(taskForces.movementVector).as(
					"movementVector",
				),
				ownerId: possiblyHidden(taskForces.ownerId).as("ownerId"),

				isVisible:
					sql<boolean>`CASE WHEN ${visibilityExists} THEN TRUE ELSE FALSE END`.as(
						"isVisible",
					),
				lastUpdate:
					sql<Date>`CASE WHEN ${visibilityExists} THEN NULL ELSE ${lastKnownStates.lastUpdate} END`
						.mapWith(lastKnownStates.lastUpdate)
						.as("lastUpdate"),
			})
			.from(taskForces)
			.where(
				and(
					eq(taskForces.gameId, parent.id),
					or(visibilityExists, isNotNull(lastKnownStates.state)),
				),
			)
			.fullJoin(
				lastKnownStates,
				and(
					eq(lastKnownStates.gameId, parent.id),
					eq(lastKnownStates.subjectId, taskForces.id),
				),
			);
	},
};
