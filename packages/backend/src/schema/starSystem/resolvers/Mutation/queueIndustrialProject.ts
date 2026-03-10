import {
	industrialProjectCatalog,
	isIndustrialProjectType,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	players,
	sql,
	starSystemIndustrialProjects,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

export const queueIndustrialProject: NonNullable<
	MutationResolvers["queueIndustrialProject"]
> = async (_parent, { starSystemId, projectType }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	if (!isIndustrialProjectType(projectType)) {
		throw createGraphQLError("Invalid industrial project type", {
			extensions: {
				code: "INVALID_INDUSTRIAL_PROJECT_TYPE",
				validValues: Object.keys(industrialProjectCatalog),
			},
		});
	}

	const starSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, starSystemId),
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
			message: "Not authorized to queue industrial projects in this game",
			code: "NOT_AUTHORIZED",
			reason: "queue-industrial-project-not-member",
			details: { gameId: starSystem.gameId, starSystemId },
		});
	}

	if (starSystem.ownerId !== context.userId) {
		context.denyAccess({
			message:
				"Not authorized to queue industrial projects for this star system",
			code: "NOT_AUTHORIZED",
			reason: "queue-industrial-project-not-owner",
			details: {
				gameId: starSystem.gameId,
				starSystemId,
				ownerId: starSystem.ownerId,
			},
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, starSystem.gameId),
		columns: { id: true, turnNumber: true, startedAt: true },
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	if (!game.startedAt) {
		throw createGraphQLError("Game has not started yet", {
			extensions: { code: "GAME_NOT_STARTED" },
		});
	}

	const [queuePositionResult] = await ctx.drizzle
		.select({
			maxQueuePosition:
				sql<number>`coalesce(max(${starSystemIndustrialProjects.queuePosition}), 0)`.as(
					"maxQueuePosition",
				),
		})
		.from(starSystemIndustrialProjects)
		.where(
			and(
				eq(starSystemIndustrialProjects.gameId, starSystem.gameId),
				eq(starSystemIndustrialProjects.starSystemId, starSystemId),
			),
		);

	const definition = industrialProjectCatalog[projectType];

	await ctx.drizzle.insert(starSystemIndustrialProjects).values({
		gameId: starSystem.gameId,
		starSystemId,
		playerId: context.userId,
		projectType,
		industryPerTurn: definition.industryPerTurn,
		workRequired: definition.workRequired,
		workDone: 0,
		completionIndustryBonus: definition.completionIndustryBonus,
		queuePosition: (queuePositionResult?.maxQueuePosition ?? 0) + 1,
		queuedAtTurn: game.turnNumber,
	});

	return {
		...starSystem,
		isVisible: true,
		lastUpdate: null,
	};
};
