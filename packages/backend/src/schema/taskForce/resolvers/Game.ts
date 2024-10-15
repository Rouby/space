import {
	type AnyColumn,
	type GetColumnData,
	and,
	eq,
	lastKnownStates,
	sql,
	taskForces,
	visibility,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForces" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select({
				id: taskForces.id,
				name: taskForces.name,
				gameId: taskForces.gameId,
				position: taskForces.position,
				orders: taskForces.orders,
				movementVector: possiblyHidden(taskForces.movementVector).as(
					"movementVector",
				),
				ownerId: possiblyHidden(taskForces.ownerId).as("ownerId"),
				isVisible: sql<boolean>`CASE WHEN ${visibility.circle} IS NOT NULL THEN TRUE ELSE FALSE END`,
				lastUpdate: sql<Date>`CASE WHEN ${visibility.circle} IS NULL THEN ${lastKnownStates.lastUpdate} ELSE NULL END`,
			})
			.from(taskForces)
			.where(and(eq(taskForces.gameId, parent.id)))
			.innerJoin(
				visibility,
				and(
					eq(visibility.gameId, taskForces.gameId),
					eq(visibility.userId, ctx.userId ?? ""),
					sql`${visibility.circle} @> ${taskForces.position}`,
				),
			)
			.leftJoin(
				lastKnownStates,
				and(
					eq(lastKnownStates.gameId, parent.id),
					eq(lastKnownStates.subjectId, taskForces.id),
				),
			);
	},
};

function possiblyHidden<T extends AnyColumn>(column: T) {
	return sql<GetColumnData<T> | null>`CASE WHEN ${visibility.circle} IS NOT NULL THEN to_jsonb(${column}) ELSE CASE WHEN ${lastKnownStates.state} IS NOT NULL THEN ${lastKnownStates.state}->'${sql.raw(column.name)}' ELSE NULL END END`;
}
