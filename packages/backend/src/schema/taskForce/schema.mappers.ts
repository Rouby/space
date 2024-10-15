import type {
	taskForceShipCommisions,
	taskForceShips,
	taskForces,
} from "@space/data/schema";

export type TaskForceMapper = typeof taskForces.$inferSelect;
export type TaskForceOrderMapper = TaskForceMapper["orders"][number];
export type TaskForceShipCommisionMapper =
	typeof taskForceShipCommisions.$inferSelect;
export type TaskForceShipMapper = typeof taskForceShips.$inferSelect;
export type TaskForceMoveOrderMapper = Extract<
	(typeof taskForces.$inferSelect)["orders"][number],
	{ type: "move" }
>;
