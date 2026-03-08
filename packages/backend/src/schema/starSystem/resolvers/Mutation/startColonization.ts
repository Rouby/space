import {
	and,
	eq,
	games,
	players,
	sql,
	starSystemColonizations,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

function turnsFromDistance(distance: number) {
	// Keep colonization delay short for this stage while still scaling by distance.
	return Math.max(2, Math.min(6, 2 + Math.floor(distance / 250)));
}

function isUniqueViolation(error: unknown) {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	);
}

export const startColonization: NonNullable<
	MutationResolvers["startColonization"]
> = async (_parent, { starSystemId }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const target = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, starSystemId),
	});

	if (!target) {
		throw createGraphQLError("Star system not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, target.gameId),
			eq(players.userId, context.userId),
		),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to colonize in this game",
			code: "NOT_AUTHORIZED",
			reason: "start-colonization-not-member",
			details: { gameId: target.gameId, starSystemId },
		});
	}

	if (target.ownerId) {
		throw createGraphQLError("Star system is already colonized", {
			extensions: { code: "INVALID_COLONIZATION_TARGET" },
		});
	}

	const canSeeSystem = await context.hasVision(target.gameId, target.position);
	if (!canSeeSystem) {
		context.denyAccess({
			message: "Not authorized to colonize this star system",
			code: "NOT_AUTHORIZED",
			reason: "start-colonization-no-vision",
			details: { gameId: target.gameId, starSystemId },
		});
	}

	const existing = await ctx.drizzle.query.starSystemColonizations.findFirst({
		where: eq(starSystemColonizations.starSystemId, starSystemId),
	});

	if (existing) {
		throw createGraphQLError("Colonization already in progress", {
			extensions: { code: "COLONIZATION_ALREADY_IN_PROGRESS" },
		});
	}

	const [nearestOwned] = await ctx.drizzle
		.select({
			id: starSystems.id,
			distance:
				sql<number>`${starSystems.position} <-> point(${target.position.x}, ${target.position.y})`.as(
					"distance",
				),
		})
		.from(starSystems)
		.where(
			and(
				eq(starSystems.gameId, target.gameId),
				eq(starSystems.ownerId, context.userId),
			),
		)
		.orderBy(sql`distance`)
		.limit(1);

	if (!nearestOwned) {
		throw createGraphQLError(
			"You need at least one colonized system before starting colonization",
			{ extensions: { code: "COLONIZATION_ORIGIN_REQUIRED" } },
		);
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, target.gameId),
		columns: { turnNumber: true },
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const turnsRequired = turnsFromDistance(nearestOwned.distance);
	const dueTurn = game.turnNumber + turnsRequired;

	try {
		await ctx.drizzle.insert(starSystemColonizations).values({
			starSystemId,
			gameId: target.gameId,
			playerId: context.userId,
			originStarSystemId: nearestOwned.id,
			turnsRequired,
			startedAtTurn: game.turnNumber,
			dueTurn,
		});
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw createGraphQLError("Colonization already in progress", {
				extensions: { code: "COLONIZATION_ALREADY_IN_PROGRESS" },
			});
		}

		throw error;
	}

	return {
		...target,
		isVisible: true,
		lastUpdate: null,
	};
};
