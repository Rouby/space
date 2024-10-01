import type { QueryResolvers } from "./../../../types.generated";
export const planets: NonNullable<QueryResolvers['planets']> = async (
	_parent,
	_arg,
	_ctx,
) => {
	return [
		{ id: "1234", name: "Earth", position: { x: 150, y: 20 } },
		{ id: "1235", name: "Mars", position: { x: 200, y: 150 } },
		{ id: "1236", name: "Mars", position: { x: 50, y: 350 } },
		{ id: "1237", name: "Mars", position: { x: 1250, y: 350 } },
	];
};
