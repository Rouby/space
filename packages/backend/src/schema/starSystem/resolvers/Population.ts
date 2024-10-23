import type { PopulationResolvers } from "./../../types.generated.js";
export const Population: PopulationResolvers = {
	id: async (_parent, _arg, _ctx) => {
		return `${_parent.starSystemId}:${_parent.allegianceToPlayerId}`;
	},
};
