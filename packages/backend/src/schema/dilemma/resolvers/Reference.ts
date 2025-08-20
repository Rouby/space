import type { ReferenceResolvers } from "./../../types.generated.js";
export const Reference: ReferenceResolvers = {
	/* Implement Reference union logic here */
	__resolveType: (obj) => {
		if ("__typename" in obj) {
			return obj.__typename;
		}
		if ("title" in obj) {
			return "Dilemma";
		}
		if ("gameId" in obj) {
			return "StarSystem";
		}
		return null;
	},
};
