export type ResourceMapper = {
	id: string;
	name: string;
	description: string;
};
export type ResourceNeedMapper = {
	resourceId: string;
	alotted: string;
	needed: string;
};
export type ResourceCostMapper = { resourceId: string; quantity: string };
