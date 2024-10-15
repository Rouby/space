import {
	eq,
	shipDesigns,
	starSystems,
	taskForceShipCommisionResourceNeeds,
	taskForceShipCommisions,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createTaskForceCommision: NonNullable<
	MutationResolvers["createTaskForceCommision"]
> = async (_parent, { commision: { starSystemId, name, ships } }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const starSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, starSystemId),
	});

	if (!starSystem) {
		throw createGraphQLError("Star system not found");
	}

	return ctx.drizzle.transaction(async (tx) => {
		const [taskForce] = await tx
			.insert(taskForces)
			.values({
				gameId: starSystem.gameId,
				ownerId: ctx.userId as string,
				name,
				position: starSystem.position,
			})
			.returning();

		for (const ship of ships) {
			const design = await tx.query.shipDesigns.findFirst({
				where: eq(shipDesigns.id, ship.shipDesignId),
				with: { resourceCosts: true },
			});

			if (!design) {
				throw createGraphQLError("Ship design not found");
			}

			const [commision] = await tx
				.insert(taskForceShipCommisions)
				.values({
					gameId: starSystem.gameId,
					starSystemId,
					taskForceId: taskForce.id,
					shipDesignId: ship.shipDesignId,
					name: ship.name,
					role: ship.role,
					progress: "0",
				})
				.returning();

			await tx.insert(taskForceShipCommisionResourceNeeds).values(
				design?.resourceCosts.map((resource) => ({
					taskForceShipCommisionId: commision.id,
					resourceId: resource.resourceId,
					alotted: "0",
					needed: resource.quantity,
				})),
			);
		}

		return { ...taskForce, isVisible: true, lastUpdate: null };
	});
};
