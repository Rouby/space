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

export type IndustrialProjectMapper = {
	id: string | number;
	gameId: string;
	starSystemId: string;
	playerId: string;
	projectType:
		| "factory_expansion"
		| "automation_hub"
		| "orbital_foundry"
		| "deep_core_scanner"
		| "xenoarchaeology_lab"
		| "habitation_dome"
		| "gravity_well_spire"
		| "fleet_drydock";
	industryPerTurn: number;
	workRequired: number;
	workDone: number;
	completionIndustryBonus: number;
	maintenanceCost: number;
	queuePosition: number;
	queuedAtTurn: number;
	startedAtTurn: number | null;
	completedAtTurn: number | null;
	createdAt: Date;
	turnsRemaining: number;
	etaTurns: number;
	effectiveMaintenanceCost?: number;
};
