import type { VectorMapper } from "../base/schema.mappers";

export type StarSystemMapper = {
	id: string;
	name: string;
	position: VectorMapper;
	isVisible: boolean;
	lastUpdate: Date;
	ownerId: string | null;
	gameId: string;
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
