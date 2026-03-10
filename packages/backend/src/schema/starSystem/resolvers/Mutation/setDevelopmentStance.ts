import type { MutationResolvers } from "./../../../types.generated.js";
import {
	developmentStances,
	parseDevelopmentStance,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	players,
	starSystemDevelopmentStances,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { DevelopmentStance } from "../../../types.generated.ts";

export const setDevelopmentStance: NonNullable<
	MutationResolvers["setDevelopmentStance"]
> = async (
	_parent: unknown,
	{ starSystemId, stance }: { starSystemId: string; stance: DevelopmentStance },
	ctx: Context,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const normalizedStance = parseDevelopmentStance(stance);
	if (!normalizedStance) {
		throw createGraphQLError("Invalid development stance", {
			extensions: {
				code: "INVALID_DEVELOPMENT_STANCE",
				validValues: developmentStances,
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
			message: "Not authorized to set development stance in this game",
			code: "NOT_AUTHORIZED",
			reason: "set-development-stance-not-member",
			details: { gameId: starSystem.gameId, starSystemId },
		});
	}

	if (starSystem.ownerId !== context.userId) {
		context.denyAccess({
			message: "Not authorized to set development stance for this star system",
			code: "NOT_AUTHORIZED",
			reason: "set-development-stance-not-owner",
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

	await ctx.drizzle
		.insert(starSystemDevelopmentStances)
		.values({
			gameId: game.id,
			starSystemId,
			playerId: context.userId,
			turnNumber: game.turnNumber,
			stance: normalizedStance,
		})
		.onConflictDoUpdate({
			target: [
				starSystemDevelopmentStances.gameId,
				starSystemDevelopmentStances.starSystemId,
				starSystemDevelopmentStances.turnNumber,
			],
			set: {
				stance: normalizedStance,
				playerId: context.userId,
			},
		});

	return {
		...starSystem,
		isVisible: true,
		lastUpdate: null,
	};
};
