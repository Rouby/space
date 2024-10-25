import type { VectorMapper } from "../base/schema.mappers";

export type StarSystemMapper = {
	id: string;
	name: string;
	position: VectorMapper;
	isVisible: boolean;
	lastUpdate: Date;
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
