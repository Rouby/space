import { and, dilemmas, eq } from "@space/data/schema";
import { GraphQLError } from "graphql";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const makeDilemmaChoice: NonNullable<
	MutationResolvers["makeDilemmaChoice"]
> = async (_parent, { dilemmaId, choiceId }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const [dilemma] = await context.drizzle
		.select()
		.from(dilemmas)
		.where(
			and(eq(dilemmas.id, dilemmaId), eq(dilemmas.ownerId, context.userId)),
		);

	if (!dilemma?.choices.some((choice) => choice.id === choiceId)) {
		throw new GraphQLError("Invalid choice");
	}

	if (dilemma.choosen) {
		throw new GraphQLError("Dilemma already resolved");
	}

	return (
		await context.drizzle
			.update(dilemmas)
			.set({ choosen: choiceId })
			.where(eq(dilemmas.id, dilemmaId))
			.returning()
	)[0];
};
