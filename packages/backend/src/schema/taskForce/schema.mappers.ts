import type { VectorMapper } from "../base/schema.mappers.ts";
import type { TaskForceShipRole } from "../types.generated.ts";

export type TaskForceMapper = {
	id: string;
	name: string | null;
	position: VectorMapper;
	orders: TaskForceOrderMapper[] | null;
	combatDeck: string[] | null;
	movementVector: VectorMapper | null;
	constructionDone: string | null;
	constructionTotal: string | null;
	constructionPerTick: string | null;
	sensorRange?: string | null;
	isVisible: boolean;
	lastUpdate: Date | null;
	ownerId: string | null;
	gameId: string;
};
export type TaskForceOrderMapper =
	| {
			id: string;
			type: "move";
			destination: { x: number; y: number };
	  }
	| {
			id: string;
			type: "follow";
			taskForceId: string;
	  }
	| {
			id: string;
			type: "colonize";
	  };
export type TaskForceShipCommisionMapper = {
	id: string;
	gameId: string;
	starSystemId: string;
	shipDesignId: string;
	taskForceId: string;
	name: string;
	role: TaskForceShipRole;
	constructionDone: string;
	constructionTotal: string;
	constructionPerTick?: number | null;
};
export type TaskForceShipMapper = {
	id: string;
	taskForceId: string;
	shipDesignId: string;
	name: string;
	role: TaskForceShipRole;
	supplyCarried: string;
	componentStates: string[];
	structuralIntegrity: string;
};
export type TaskForceMoveOrderMapper = Extract<
	TaskForceOrderMapper,
	{ type: "move" }
>;
export type TaskForceFollowOrderMapper = Extract<
	TaskForceOrderMapper,
	{ type: "follow" }
>;
export type TaskForceColonizeOrderMapper = Extract<
	TaskForceOrderMapper,
	{ type: "colonize" }
>;

export type TaskForceEngagementParticipantStateMapper = {
	taskForceId: string;
	hp: number;
	maxHp: number;
	shieldHp: number;
	shieldMaxHp: number;
	armorRating: number;
	hand: string[];
	deckRemaining: number;
	nextDamageBonus: number;
	nextDamageReduction: number;
	submittedCardId: string | null;
};

export type TaskForceEngagementRoundLogEntryMapper = {
	round: number;
	attackerTaskForceId: string;
	targetTaskForceId: string;
	cardId: string;
	effectType: string;
	resolvedValue: number;
	shieldDamage: number;
	armorAbsorbed: number;
	hullDamage: number;
	attackerHpAfter: number;
	targetHpAfter: number;
};

export type TaskForceEngagementMapper = {
	id: string;
	gameId: string;
	taskForceIdA: string;
	taskForceIdB: string;
	ownerIdA: string;
	ownerIdB: string;
	position: VectorMapper;
	phase: string;
	currentRound: number;
	stateA: unknown;
	stateB: unknown;
	submittedCardIdA: string | null;
	submittedCardIdB: string | null;
	roundLog: unknown;
	startedAtTurn: number;
	resolvedAtTurn: number | null;
	winnerTaskForceId: string | null;
};
