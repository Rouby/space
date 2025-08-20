import { and, dilemmas, eq } from "@space/data/schema";
import type { Context } from "../../../context.js";
import type { GameResolvers } from "./../../types.generated.js";
export const Game: Pick<GameResolvers, "dilemmas" | "__isTypeOf"> = {
	/* Implement Game resolver logic here */
	dilemmas: async (_parent, _arg, ctx) => {
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		return ctx.drizzle
			.select()
			.from(dilemmas)
			.where(
				and(
					eq(dilemmas.ownerId, context.userId),
					eq(dilemmas.gameId, _parent.id),
				),
			);
	},
};
