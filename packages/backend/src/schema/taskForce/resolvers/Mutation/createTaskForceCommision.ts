import {
	eq,
	shipComponentResourceCosts,
	shipDesignComponents,
	shipDesignResourceCosts,
	shipDesignsWithStats,
	sql,
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
			const [design] = await tx
				.select({
					id: shipDesignsWithStats.id,
					name: shipDesignsWithStats.name,
					constructionCost: shipDesignsWithStats.constructionCost,
				})
				.from(shipDesignsWithStats)
				.where(eq(shipDesignsWithStats.id, ship.shipDesignId));

			const AllCosts = ctx.drizzle.$with("AllCosts").as((qb) =>
				qb
					.select({
						resourceId: shipDesignResourceCosts.resourceId,
						quantity: shipDesignResourceCosts.quantity,
					})
					.from(shipDesignResourceCosts)
					.where(eq(shipDesignResourceCosts.shipDesignId, design.id))
					.unionAll(
						ctx.drizzle
							.select({
								resourceId: shipComponentResourceCosts.resourceId,
								quantity: shipComponentResourceCosts.quantity,
							})
							.from(shipDesignComponents)
							.where(eq(shipDesignComponents.shipDesignId, design.id))
							.innerJoin(
								shipComponentResourceCosts,
								eq(
									shipComponentResourceCosts.shipComponentId,
									shipDesignComponents.shipComponentId,
								),
							),
					),
			);

			const resourceCosts = await ctx.drizzle
				.with(AllCosts)
				.select({
					resourceId: AllCosts.resourceId,
					quantity: sql`sum(${AllCosts.quantity})`
						.mapWith(AllCosts.quantity)
						.as("quantity"),
				})
				.from(AllCosts)
				.groupBy(AllCosts.resourceId);

			if (!design) {
				throw createGraphQLError("Ship design not found");
			}

			const constructionTotal = +design.constructionCost;

			const [commision] = await tx
				.insert(taskForceShipCommisions)
				.values({
					gameId: starSystem.gameId,
					starSystemId,
					taskForceId: taskForce.id,
					shipDesignId: ship.shipDesignId,
					name: ship.name,
					role: ship.role,
					constructionDone: "0",
					constructionTotal: `${constructionTotal}`,
				})
				.returning();

			await tx.insert(taskForceShipCommisionResourceNeeds).values(
				resourceCosts.map((resource) => ({
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
