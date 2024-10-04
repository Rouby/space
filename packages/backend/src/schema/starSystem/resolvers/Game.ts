import { eq, starSystems } from "@space/data/schema";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: async (_parent, _args, ctx) => {
		return ctx.drizzle.query.starSystems.findMany({
			where: eq(starSystems.gameId, _parent.id),
		});
	},
};
