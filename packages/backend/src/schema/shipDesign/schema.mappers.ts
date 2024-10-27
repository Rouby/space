export type ShipDesignMapper = {
	id: string;
	name: string;
	description: string;
	decommissioned: boolean;
	previousDesignId: string | null;
};
export type ResourceCostMapper = { resourceId: string; quantity: string };
