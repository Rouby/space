import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: StarSystemResolvers = {
	id: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.name;
	},
	position: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.position;
	},
};
