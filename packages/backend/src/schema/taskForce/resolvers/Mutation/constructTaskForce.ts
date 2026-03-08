import {
	and,
	eq,
	players,
	shipComponentResourceCosts,
	shipDesignComponents,
	shipDesigns,
	sql,
	starSystemResourceDepots,
	starSystems,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

export const constructTaskForce: NonNullable<
	MutationResolvers["constructTaskForce"]
> = async (_parent, { input }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const originSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, input.starSystemId),
	});

	if (!originSystem) {
		throw createGraphQLError("Star system not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, originSystem.gameId),
			eq(players.userId, context.userId),
		),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to construct fleets in this game",
			code: "NOT_AUTHORIZED",
			reason: "construct-task-force-not-member",
			details: {
				gameId: originSystem.gameId,
				starSystemId: input.starSystemId,
			},
		});
	}

	if (originSystem.ownerId !== context.userId) {
		throw createGraphQLError("You can only construct fleets at owned systems", {
			extensions: { code: "INVALID_CONSTRUCTION_ORDER" },
		});
	}

	const shipDesign = await ctx.drizzle.query.shipDesigns.findFirst({
		where: and(
			eq(shipDesigns.id, input.shipDesignId),
			eq(shipDesigns.gameId, originSystem.gameId),
			eq(shipDesigns.ownerId, context.userId),
		),
	});

	if (!shipDesign || shipDesign.decommissioned) {
		throw createGraphQLError("Ship design is not available", {
			extensions: { code: "INVALID_CONSTRUCTION_ORDER" },
		});
	}

	const existingName = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.gameId, originSystem.gameId),
			eq(taskForces.ownerId, context.userId),
			eq(taskForces.name, input.name),
		),
	});

	if (existingName) {
		throw createGraphQLError("Task force name already exists", {
			extensions: { code: "DUPLICATE_TASK_FORCE_NAME" },
		});
	}

	const costs = await ctx.drizzle
		.select({
			resourceId: shipComponentResourceCosts.resourceId,
			quantity:
				sql<string>`sum(${shipComponentResourceCosts.quantity})::text`.as(
					"quantity",
				),
		})
		.from(shipDesignComponents)
		.innerJoin(
			shipComponentResourceCosts,
			eq(
				shipComponentResourceCosts.shipComponentId,
				shipDesignComponents.shipComponentId,
			),
		)
		.where(eq(shipDesignComponents.shipDesignId, shipDesign.id))
		.groupBy(shipComponentResourceCosts.resourceId);

	const depots = await ctx.drizzle
		.select({
			resourceId: starSystemResourceDepots.resourceId,
			quantity: starSystemResourceDepots.quantity,
		})
		.from(starSystemResourceDepots)
		.where(eq(starSystemResourceDepots.starSystemId, originSystem.id));

	const depotByResource = new Map(
		depots.map((depot) => [depot.resourceId, Number(depot.quantity)]),
	);

	for (const cost of costs) {
		const required = Number(cost.quantity);
		const available = depotByResource.get(cost.resourceId) ?? 0;
		if (available < required) {
			throw createGraphQLError("Insufficient resources for construction", {
				extensions: { code: "INSUFFICIENT_RESOURCES" },
			});
		}
	}

	const [created] = await ctx.drizzle.transaction(async (tx) => {
		for (const cost of costs) {
			const updatedDepots = await tx
				.update(starSystemResourceDepots)
				.set({
					quantity: sql`${starSystemResourceDepots.quantity} - ${Number(cost.quantity)}::numeric`,
				})
				.where(
					and(
						eq(starSystemResourceDepots.starSystemId, originSystem.id),
						eq(starSystemResourceDepots.resourceId, cost.resourceId),
						sql`${starSystemResourceDepots.quantity} >= ${Number(cost.quantity)}::numeric`,
					),
				)
				.returning({ resourceId: starSystemResourceDepots.resourceId });

			if (updatedDepots.length !== 1) {
				throw createGraphQLError("Insufficient resources for construction", {
					extensions: { code: "INSUFFICIENT_RESOURCES" },
				});
			}
		}

		return tx
			.insert(taskForces)
			.values({
				gameId: originSystem.gameId,
				ownerId: context.userId,
				name: input.name,
				position: originSystem.position,
				movementVector: null,
				orders: [],
			})
			.returning();
	});

	return { ...created, isVisible: true, lastUpdate: null };
};
