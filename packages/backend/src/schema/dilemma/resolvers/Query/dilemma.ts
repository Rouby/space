import { dilemmas, eq } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
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
		.where(eq(dilemmas.id, _arg.id));

	if (!dilemma) {
		throw createGraphQLError("Dilemma not found");
	}

	return dilemma;
};
