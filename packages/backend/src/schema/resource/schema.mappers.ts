export type ResourceMapper = {
	id: string;
	name: string;
	kind: string;
	description: string;
	statBonuses: { stat: string; modifier: number }[] | null;
};
export type ResourceNeedMapper = {
	resourceId: string;
	alotted: string;
	needed: string;
};
export type ResourceCostMapper = { resourceId: string; quantity: string };
