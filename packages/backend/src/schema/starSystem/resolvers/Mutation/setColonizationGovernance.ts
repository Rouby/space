import {
	and,
	colonizationGovernances,
	eq,
	games,
	playerColonizationGovernances,
	players,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
import type { ColonizationGovernance } from "../../../types.generated.ts";

export const setColonizationGovernance: NonNullable<
	MutationResolvers["setColonizationGovernance"]
> = async (
	_parent: unknown,
	{
		starSystemId,
		governance,
	}: { starSystemId: string; governance?: ColonizationGovernance | null },
	ctx: Context,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

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
			message: "Not authorized to set colonization governance in this game",
			code: "NOT_AUTHORIZED",
			reason: "set-colonization-governance-not-member",
			details: { gameId: starSystem.gameId, starSystemId },
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, starSystem.gameId),
		columns: { id: true, startedAt: true },
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

	if (starSystem.ownerId) {
		throw createGraphQLError(
			"Colonization governance can only target unowned systems",
			{
				extensions: { code: "INVALID_TARGET" },
			},
		);
	}

	if (governance && !colonizationGovernances.includes(governance)) {
		throw createGraphQLError("Invalid colonization governance", {
			extensions: {
				code: "INVALID_COLONIZATION_GOVERNANCE",
				validValues: colonizationGovernances,
			},
		});
	}

	if (!governance) {
		await ctx.drizzle
			.delete(playerColonizationGovernances)
			.where(
				and(
					eq(playerColonizationGovernances.gameId, starSystem.gameId),
					eq(playerColonizationGovernances.ownerId, context.userId),
					eq(playerColonizationGovernances.starSystemId, starSystemId),
				),
			);
	} else {
		await ctx.drizzle
			.insert(playerColonizationGovernances)
			.values({
				gameId: starSystem.gameId,
				ownerId: context.userId,
				starSystemId,
				governance,
			})
			.onConflictDoUpdate({
				target: [
					playerColonizationGovernances.gameId,
					playerColonizationGovernances.ownerId,
					playerColonizationGovernances.starSystemId,
				],
				set: { governance },
			});
	}

	return {
		...starSystem,
		isVisible: true,
		lastUpdate: null,
	};
};
