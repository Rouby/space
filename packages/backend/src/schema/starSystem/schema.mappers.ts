import type { VectorMapper } from "../base/schema.mappers.ts";

export type StarSystemMapper = {
	id: string;
	name: string;
	position: VectorMapper;
	industry?: number | null;
	isVisible: boolean;
	lastUpdate: Date | null;
	ownerId: string | null;
	gameId: string;
	discoverySlots: number | null;
	discoveryProgress: string | null;
};
export type ResourceDiscoveryMapper = {
	starSystemId: string;
	resourceId: string;
	discoveredAt: Date;
	remainingDeposits: string;
};
export type ResourceDepotMapper = {
	resourceId: string;
	quantity: string;
	starSystemId: string;
};
export type PopulationMapper = {
	starSystemId: string;
	amount: bigint;
	allegianceToPlayerId?: string | null;
};

export type StarSystemColonizationMapper = {
	starSystemId: string;
	gameId: string;
	playerId: string;
	originStarSystemId: string;
	turnsRequired: number;
	startedAtTurn: number;
	dueTurn: number;
	startedAt: Date;
};
