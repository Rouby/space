import {
	and,
	eq,
	inArray,
	isNull,
	players,
	shipComponentResourceCosts,
	shipComponents,
	shipDesignComponents,
	shipDesigns,
	sql,
	starSystemResourceDepots,
	starSystems,
	taskForceShipDesigns,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";
import {
	buildStarterDeck,
	deriveCombatProfile,
} from "../combatProfileLogic.ts";

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
			extensions: {
				code: "INVALID_CONSTRUCTION_ORDER",
				violation: "ORIGIN_NOT_OWNED",
				starSystemId: input.starSystemId,
			},
		});
	}

	if (!input.shipDesignIds || input.shipDesignIds.length === 0) {
		throw createGraphQLError("At least one ship design is required", {
			extensions: {
				code: "INVALID_CONSTRUCTION_ORDER",
				violation: "NO_SHIP_DESIGNS",
			},
		});
	}

	const resolvedDesigns = await ctx.drizzle.query.shipDesigns.findMany({
		where: and(
			inArray(shipDesigns.id, input.shipDesignIds),
			eq(shipDesigns.gameId, originSystem.gameId),
			eq(shipDesigns.ownerId, context.userId),
		),
	});

	// Verify every requested ID was found and is not decommissioned
	for (const designId of input.shipDesignIds) {
		const found = resolvedDesigns.find((d) => d.id === designId);
		if (!found || found.decommissioned) {
			throw createGraphQLError("Ship design is not available", {
				extensions: {
					code: "INVALID_CONSTRUCTION_ORDER",
					violation: "SHIP_DESIGN_UNAVAILABLE",
					shipDesignId: designId,
				},
			});
		}
	}

	const existingName = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.gameId, originSystem.gameId),
			eq(taskForces.ownerId, context.userId),
			eq(taskForces.name, input.name),
			isNull(taskForces.deletedAt),
		),
	});

	if (existingName) {
		throw createGraphQLError("Task force name already exists", {
			extensions: { code: "DUPLICATE_TASK_FORCE_NAME" },
		});
	}

	// Aggregate costs across all ship designs
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
		.where(inArray(shipDesignComponents.shipDesignId, input.shipDesignIds))
		.groupBy(shipComponentResourceCosts.resourceId);

	const [{ constructionTotal: constructionTotalRaw }] = await ctx.drizzle
		.select({
			constructionTotal:
				sql<string>`coalesce(sum(${shipComponents.constructionCost}), 0)::text`.as(
					"constructionTotal",
				),
		})
		.from(shipDesignComponents)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.where(inArray(shipDesignComponents.shipDesignId, input.shipDesignIds));

	const constructionTotal = Math.max(1, Number(constructionTotalRaw ?? "0"));

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
			throw createGraphQLError(
				"Insufficient special resources for construction",
				{
					extensions: {
						code: "INSUFFICIENT_RESOURCES",
						violation: "RESOURCE_SHORTAGE",
						resourceId: cost.resourceId,
						required,
						available,
						starSystemId: originSystem.id,
					},
				},
			);
		}
	}

	if (originSystem.industry <= 0) {
		throw createGraphQLError("This star system has no industrial capacity", {
			extensions: {
				code: "INSUFFICIENT_INDUSTRY",
				violation: "INDUSTRY_SHORTAGE",
				starSystemId: originSystem.id,
			},
		});
	}

	// Derive combat profile from all ship design components to build starter deck
	const allComponents = await ctx.drizzle
		.select({
			weaponDamage: shipComponents.weaponDamage,
			shieldStrength: shipComponents.shieldStrength,
			thruster: shipComponents.thruster,
			sensorPrecision: shipComponents.sensorPrecision,
			crewCapacity: shipComponents.crewCapacity,
			crewNeed: shipComponents.crewNeed,
		})
		.from(shipDesignComponents)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.where(inArray(shipDesignComponents.shipDesignId, input.shipDesignIds));

	const profile = deriveCombatProfile(allComponents);
	const starterDeck = buildStarterDeck(profile);

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
					extensions: {
						code: "INSUFFICIENT_RESOURCES",
						violation: "RESOURCE_SHORTAGE_RACE",
						resourceId: cost.resourceId,
						required: Number(cost.quantity),
						starSystemId: originSystem.id,
					},
				});
			}
		}

		const [tf] = await tx
			.insert(taskForces)
			.values({
				gameId: originSystem.gameId,
				ownerId: context.userId,
				name: input.name,
				position: originSystem.position,
				movementVector: null,
				constructionStarSystemId: originSystem.id,
				constructionDone: "0",
				constructionTotal: constructionTotal.toString(),
				constructionPerTick: "0",
				combatDeck: starterDeck,
				orders: [],
			})
			.returning();

		// Link assigned ship designs via junction table
		await tx.insert(taskForceShipDesigns).values(
			input.shipDesignIds.map((shipDesignId) => ({
				taskForceId: tf.id,
				shipDesignId,
			})),
		);

		return [tf];
	});

	return { ...created, isVisible: true, lastUpdate: null };
};
