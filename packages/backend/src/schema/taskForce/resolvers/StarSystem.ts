import {
	and,
	eq,
	getLastKnownHelper,
	isNotNull,
	lastKnownStates,
	or,
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
		const {
			VisibilityQuery,
			visibilityExists,
			possiblyHidden,
			knownOrLastKnown,
		} = getLastKnownHelper({
			tx: ctx.drizzle,
			gameId: parent.gameId,
			userId: ctx.userId ?? "",
			position: taskForces.position,
		});

		return await ctx.drizzle
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
					eq(taskForces.gameId, parent.gameId),
					sql`${taskForces.position} <-> point(${parent.position.x}, ${parent.position.y}) < 10`,
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
