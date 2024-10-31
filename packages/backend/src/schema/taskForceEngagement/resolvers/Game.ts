import {
	and,
	eq,
	getLastKnownHelper,
	getTableColumns,
	or,
	taskForceEngagements,
	taskForceEngagementsToTaskForces,
	taskForces,
} from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "taskForceEngagements" | "__isTypeOf"> =
	{
		/* Implement Game resolver logic here */
		taskForceEngagements: async (parent, _arg, ctx) => {
			const { VisibilityQuery, visibilityExists } = getLastKnownHelper({
				tx: ctx.drizzle,
				gameId: parent.id,
				userId: ctx.userId ?? "",
				position: taskForces.position,
			});

			return ctx.drizzle
				.with(VisibilityQuery)
				.select(getTableColumns(taskForceEngagements))
				.from(taskForceEngagements)
				.innerJoin(
					taskForceEngagementsToTaskForces,
					eq(
						taskForceEngagementsToTaskForces.taskForceEngagementId,
						taskForceEngagements.id,
					),
				)
				.innerJoin(
					taskForces,
					eq(taskForces.id, taskForceEngagementsToTaskForces.taskForceId),
				)
				.where(and(eq(taskForces.gameId, parent.id), or(visibilityExists)))
				.groupBy(taskForceEngagements.id);
		},
	};
