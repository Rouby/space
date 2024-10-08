export type GameEvent =
	| TaskForceAppeared
	| TaskForcePosition
	| TaskForceDisappeared
	| TaskForceCommisionProgress
	| TaskForceCommisionFinished;

interface TaskForceAppeared {
	type: "taskForce:appeared";
	id: string;
	userId: string;
	position: { x: number; y: number };
}
interface TaskForcePosition {
	type: "taskForce:position";
	id: string;
	position: { x: number; y: number };
}
interface TaskForceDisappeared {
	type: "taskForce:disappeared";
	id: string;
	userId: string;
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
