export type GameEvent =
	| TaskForceAppeared
	| TaskForcePosition
	| TaskForceDisappeared
	| TaskForceDestroyed
	| TaskForceCommisionProgress
	| TaskForceCommisionFinished
	| TaskForceEngagementStarted
	| TaskForceEngagementTaskForceJoined
	| TaskForceEngagementPhaseProgress
	| TaskForceEngagementChangePhase
	| TaskForceEngagementEnded;

interface TaskForceAppeared {
	type: "taskForce:appeared";
	id: string;
	userId: string;
	position: { x: number; y: number };
	movementVector: { x: number; y: number } | null;
}
interface TaskForcePosition {
	type: "taskForce:position";
	id: string;
	position: { x: number; y: number };
	movementVector: { x: number; y: number } | null;
}
interface TaskForceDisappeared {
	type: "taskForce:disappeared";
	id: string;
	userId: string;
	position: { x: number; y: number };
}

interface TaskForceDestroyed {
	type: "taskForce:destroyed";
	id: string;
	position: { x: number; y: number };
}

interface TaskForceCommisionProgress {
	type: "taskForce:commisionProgress";
	id: string;
	systemId: string;
	progress: number;
	total: number;
}
interface TaskForceCommisionFinished {
	type: "taskForce:commisionFinished";
	id: string;
	systemId: string;
	taskForceId: string;
}

interface TaskForceEngagementStarted {
	type: "taskForceEngagement:started";
	id: string;
	taskForceIdA: string;
	taskForceIdB: string;
	position: { x: number; y: number };
}

interface TaskForceEngagementTaskForceJoined {
	type: "taskForceEngagement:taskForceJoined";
	id: string;
	taskForceId: string;
}

interface TaskForceEngagementPhaseProgress {
	type: "taskForceEngagement:phaseProgress";
	id: string;
	phaseProgress: number;
}

interface TaskForceEngagementChangePhase {
	type: "taskForceEngagement:changePhase";
	id: string;
	phase: "locating" | "engagement" | "resolution";
}

interface TaskForceEngagementEnded {
	type: "taskForceEngagement:ended";
	id: string;
}