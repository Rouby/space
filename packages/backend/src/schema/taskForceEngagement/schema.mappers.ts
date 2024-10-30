import type { VectorMapper } from "../base/schema.mappers.ts";

export type TaskForceEngagementMapper = {
	id: string;
	gameId: string;
	position: VectorMapper;
	startedAt: Date;
	phase: "locating" | "engagement" | "resolution";
	phaseProgress: number;
};
