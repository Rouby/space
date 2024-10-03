import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "starSystems" | "__isTypeOf"> = {
	starSystems: () => {
		return [];
	},
};
