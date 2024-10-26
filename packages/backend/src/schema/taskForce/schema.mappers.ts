import type { VectorMapper } from "../base/schema.mappers";
import type { TaskForceShipRole } from "../types.generated";

export type TaskForceMapper = {
	id: string;
	name: string | null;
	position: VectorMapper;
	orders: TaskForceOrderMapper[] | null;
	movementVector: VectorMapper | null;
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
};
export type TaskForceShipMapper = {
	id: string;
	taskForceId: string;
	shipDesignId: string;
	name: string;
	role: TaskForceShipRole;
	hullState: string;
	shieldState: string;
	armorState: string;
	weaponState: string;
	supplyCarried: string;
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
