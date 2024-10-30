import {
	eq,
	getTableColumns,
	sql,
	taskForceEngagementsToTaskForces,
	taskForces,
} from "@space/data/schema";
import type { TaskForceEngagementResolvers } from "./../../types.generated.js";
export const TaskForceEngagement: TaskForceEngagementResolvers = {
	/* Implement TaskForceEngagement resolver logic here */
	taskForces: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select({
				...getTableColumns(taskForces),
				isVisible: sql<boolean>`TRUE`,
				lastUpdate: sql<null>`NULL`,
			})
			.from(taskForces)
			.innerJoin(
				taskForceEngagementsToTaskForces,
				eq(taskForceEngagementsToTaskForces.taskForceId, taskForces.id),
			)
			.where(
				eq(taskForceEngagementsToTaskForces.taskForceEngagementId, parent.id),
			);
	},
};
