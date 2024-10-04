import type { taskForces } from "@space/data/schema";

export type TaskForceMapper = typeof taskForces.$inferSelect;
export type TaskForceOrderMapper = TaskForceMapper["orders"][number];
export type TaskForceCommisionFinishedMapper = {
	id: string;
	taskForceId: string;
};
