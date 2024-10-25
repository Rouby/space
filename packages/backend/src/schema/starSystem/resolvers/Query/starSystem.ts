import {
	and,
	eq,
	lastKnownStates,
	possiblyHidden,
	sql,
	starSystems,
	visibility,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { QueryResolvers } from "./../../../types.generated.js";
export const starSystem: NonNullable<QueryResolvers["starSystem"]> = async (
	_parent,
	{ id },
	ctx,
) => {
	ctx.throwWithoutClaim("urn:space:claim");

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
