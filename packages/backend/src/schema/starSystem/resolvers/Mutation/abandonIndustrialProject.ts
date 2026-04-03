import {
	and,
	eq,
	isNotNull,
	players,
	starSystemIndustrialProjects,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

export const abandonIndustrialProject: NonNullable<
	MutationResolvers["abandonIndustrialProject"]
> = async (_parent, { projectId }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const project =
		await ctx.drizzle.query.starSystemIndustrialProjects.findFirst({
			where: and(
				eq(starSystemIndustrialProjects.id, projectId),
				isNotNull(starSystemIndustrialProjects.completedAtTurn),
			),
		});

	if (!project) {
		throw createGraphQLError("Completed industrial project not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const starSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, project.starSystemId),
	});

	if (!starSystem) {
		throw createGraphQLError("Star system not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, starSystem.gameId),
			eq(players.userId, context.userId),
		),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to abandon industrial projects in this game",
			code: "NOT_AUTHORIZED",
			reason: "abandon-industrial-project-not-member",
			details: { gameId: starSystem.gameId, projectId },
		});
	}

	if (starSystem.ownerId !== context.userId) {
		context.denyAccess({
			message:
				"Not authorized to abandon industrial projects for this star system",
			code: "NOT_AUTHORIZED",
			reason: "abandon-industrial-project-not-owner",
			details: {
				gameId: starSystem.gameId,
				starSystemId: project.starSystemId,
				ownerId: starSystem.ownerId,
			},
		});
	}

	await ctx.drizzle
		.delete(starSystemIndustrialProjects)
		.where(eq(starSystemIndustrialProjects.id, projectId));

	return {
		...starSystem,
		isVisible: true,
		lastUpdate: null,
	};
};
