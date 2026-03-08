import { and, dilemmas, eq } from "@space/data/schema";
import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "./../../../types.generated.js";
export const dilemma: NonNullable<QueryResolvers["dilemma"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const [dilemma] = await context.drizzle
		.select()
		.from(dilemmas)
		.where(and(eq(dilemmas.id, _arg.id), eq(dilemmas.ownerId, context.userId)));

	if (!dilemma) {
		context.denyAccess({
			message: "Dilemma not found",
			code: "NOT_AUTHORIZED",
			reason: "dilemma-query-not-owner",
			details: { dilemmaId: _arg.id },
		});
	}

	return dilemma;
};
