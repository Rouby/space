import {
	and,
	eq,
	lastKnownStates,
	players,
	possiblyHidden,
	sql,
	starSystems,
	visibility,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { QueryResolvers } from "./../../../types.generated.js";
export const starSystem: NonNullable<QueryResolvers["starSystem"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const starSystemMeta = await ctx.drizzle.query.starSystems.findFirst({
		columns: { id: true, gameId: true },
		where: eq(starSystems.id, id),
	});

	if (!starSystemMeta) {
		throw createGraphQLError("Star system not found");
	}

	const player = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, starSystemMeta.gameId),
			eq(players.userId, context.userId),
		),
	});

	if (!player) {
		context.denyAccess({
			message: "Not authorized to access this star system",
			code: "NOT_AUTHORIZED",
			reason: "star-system-query-not-member",
			details: { starSystemId: id, gameId: starSystemMeta.gameId },
		});
	}

	const [starSystem] = await ctx.drizzle
		.select({
			id: starSystems.id,
			name: starSystems.name,
			gameId: starSystems.gameId,
			position: starSystems.position,
			discoverySlots: possiblyHidden(starSystems.discoverySlots).as(
				"discoverySlots",
			),
			discoveryProgress: possiblyHidden(starSystems.discoveryProgress).as(
				"discoveryProgress",
			),
			ownerId: possiblyHidden(starSystems.ownerId).as("ownerId"),
			industry: possiblyHidden(starSystems.industry).as("industry"),
			isVisible: sql<boolean>`CASE WHEN ${visibility.circle} IS NOT NULL THEN TRUE ELSE FALSE END`,
			lastUpdate: sql<Date>`CASE WHEN ${visibility.circle} IS NULL THEN ${lastKnownStates.lastUpdate} ELSE NULL END`,
		})
		.from(starSystems)
		.where(eq(starSystems.id, id))
		.leftJoin(
			visibility,
			and(
				eq(visibility.gameId, starSystems.gameId),
				eq(visibility.userId, ctx.userId ?? ""),
				sql`${visibility.circle} @> ${starSystems.position}`,
			),
		)
		.leftJoin(
			lastKnownStates,
			and(
				eq(lastKnownStates.gameId, starSystems.gameId),
				eq(lastKnownStates.subjectId, starSystems.id),
			),
		);

	if (!starSystem) {
		throw createGraphQLError("Star system not found");
	}

	return starSystem;
};
