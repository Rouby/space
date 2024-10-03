import { eq, users } from "@space/data/schema";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: PlayerResolvers = {
	id: async (parent, _arg, _ctx) => {
		return `${parent.gameId}-${parent.userId}`;
	},
	user: async (parent, _args, ctx) => {
		const user = await ctx.drizzle.query.users.findFirst({
			where: eq(users.id, parent.userId),
		});
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	},
};
