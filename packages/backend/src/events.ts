export type GameEvent =
	| TurnEnded
	| NewTurnCalculated
	| TaskForceAppeared
	| TaskForcePosition
	| TaskForceDisappeared
	| TaskForceDestroyed
	| TaskForceEngagementStarted
	| TaskForceEngagementTaskForceJoined
	| TaskForceEngagementTaskForceLeft
	| TaskForceEngagementPhaseProgress
	| TaskForceEngagementChangePhase
	| TaskForceEngagementWeaponFired
	| TaskForceEngagementEnded
	| StarSystemAppeared
	| StarSystemDisappeared
	| StarSystemPopulationChanged
	| StarSystemDiscoveryProgress
	| StarSystemColonizationProgress
	| StarSystemOwnerChanged
	| TaskForceCommisionProgress;

interface TurnEnded {
	type: "game:turnEnded";
	gameId: string;
	turnNumber: number;
}

interface NewTurnCalculated {
	type: "game:newTurnCalculated";
	gameId: string;
	turnNumber: number;
}

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
}

interface TaskForceDestroyed {
	type: "taskForce:destroyed";
	id: string;
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
	position: { x: number; y: number };
	taskForceId: string;
}
interface TaskForceEngagementTaskForceLeft {
	type: "taskForceEngagement:taskForceLeft";
	id: string;
	position: { x: number; y: number };
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

interface TaskForceEngagementWeaponFired {
	type: "taskForceEngagement:weaponFired";
	id: string;
	attackerShipId: string;
	targetShipId: string;
	weaponComponentId: string;
	weaponComponentPosition: number;
	damage: number;
	round?: number;
	effectType?: "damage" | "buff" | "special";
	resolvedValue?: number;
}

interface TaskForceEngagementEnded {
	type: "taskForceEngagement:ended";
	id: string;
}

interface StarSystemAppeared {
	type: "starSystem:appeared";
	id: string;
	userId: string;
	position: { x: number; y: number };
}
interface StarSystemDisappeared {
	type: "starSystem:disappeared";
	id: string;
	userId: string;
	position: { x: number; y: number };
}

interface StarSystemPopulationChanged {
	type: "starSystem:populationChanged";
	id: string;
	populationId: string;
	amount: bigint;
	growthPerTick: bigint;
}
interface StarSystemDiscoveryProgress {
	type: "starSystem:discoveryProgress";
	id: string;
	discoveryProgress: number;
	discoveryProgressChange: number;
}
interface StarSystemColonizationProgress {
	type: "starSystem:colonizationProgress";
	id: string;
	turnsRemaining: number;
}
interface StarSystemOwnerChanged {
	type: "starSystem:ownerChanged";
	id: string;
	ownerId: string;
}

interface TaskForceCommisionProgress {
	type: "taskForceCommision:progress";
	id: string;
	starSystemId: string;
	constructionDone: number;
	constructionTotal: number;
	constructionPerTick: number;
}
