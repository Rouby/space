import type { PositionableResolvers } from "./../../types.generated.js";
export const Positionable: PositionableResolvers = {
	/* Implement Positionable interface logic here */
	__resolveType: (parent, _arg, _ctx) => {
		return parent.__typename;
	},
};
