import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<
	PlayerResolvers,
	"color" | "id" | "name" | "user" | "__isTypeOf"
> = {
	id: async (parent, _arg, _ctx) => {
		return `${parent.gameId}-${parent.userId}`;
	},
	color: async (_parent, _arg, _ctx) => {
		return _parent.color;
	},
	name: async (parent, _arg, _ctx) => {
		return parent.user.name;
	},
	user: async (_parent, _arg, _ctx) => {
		return _parent.user;
	},
};
