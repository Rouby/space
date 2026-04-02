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

	if (!input.shipDesigns || input.shipDesigns.length === 0) {
		throw createGraphQLError("At least one ship design is required", {
			extensions: {
				code: "INVALID_CONSTRUCTION_ORDER",
				violation: "NO_SHIP_DESIGNS",
			},
		});
	}

	const resolvedDesigns = await ctx.drizzle.query.shipDesigns.findMany({
		where: and(
			inArray(
				shipDesigns.id,
				input.shipDesigns.map((d) => d.shipDesignId),
			),
			eq(shipDesigns.gameId, originSystem.gameId),
			eq(shipDesigns.ownerId, context.userId),
		),
	});

	// Verify every requested ID was found and is not decommissioned
	for (const designInput of input.shipDesigns) {
		const found = resolvedDesigns.find(
			(d) => d.id === designInput.shipDesignId,
		);
		if (!found || found.decommissioned) {
			throw createGraphQLError("Ship design is not available", {
				extensions: {
					code: "INVALID_CONSTRUCTION_ORDER",
					violation: "SHIP_DESIGN_UNAVAILABLE",
					shipDesignId: designInput.shipDesignId,
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
	const uniqueDesignIds = input.shipDesigns.map((d) => d.shipDesignId);

	const costPerDesign = await ctx.drizzle
		.select({
			shipDesignId: shipDesignComponents.shipDesignId,
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
		.where(inArray(shipDesignComponents.shipDesignId, uniqueDesignIds))
		.groupBy(
			shipDesignComponents.shipDesignId,
			shipComponentResourceCosts.resourceId,
		);

	const constructionCostPerDesign = await ctx.drizzle
		.select({
			shipDesignId: shipDesignComponents.shipDesignId,
			constructionCost:
				sql<string>`coalesce(sum(${shipComponents.constructionCost}), 0)::text`.as(
					"constructionCost",
				),
		})
		.from(shipDesignComponents)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.where(inArray(shipDesignComponents.shipDesignId, uniqueDesignIds))
		.groupBy(shipDesignComponents.shipDesignId);

	// Now aggregate them using input.shipDesigns quantity
	const totalCosts = new Map<string, number>();
	let constructionTotalRaw = 0;

	for (const inputDesign of input.shipDesigns) {
		const designCosts = costPerDesign.filter(
			(c) => c.shipDesignId === inputDesign.shipDesignId,
		);
		for (const cost of designCosts) {
			totalCosts.set(
				cost.resourceId,
				(totalCosts.get(cost.resourceId) ?? 0) +
					Number(cost.quantity) * inputDesign.quantity,
			);
		}

		const designConstructionCost = constructionCostPerDesign.find(
			(c) => c.shipDesignId === inputDesign.shipDesignId,
		);
		if (designConstructionCost) {
			constructionTotalRaw +=
				Number(designConstructionCost.constructionCost) * inputDesign.quantity;
		}
	}

	const costs = Array.from(totalCosts.entries()).map(
		([resourceId, quantity]) => ({ resourceId, quantity }),
	);
	const constructionTotal = Math.max(1, constructionTotalRaw);

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
		.where(
			inArray(
				shipDesignComponents.shipDesignId,
				input.shipDesigns.map((d) => d.shipDesignId),
			),
		);

	const [strategicStats] = await ctx.drizzle
		.select({
			ftlSpeed: sql<string | null>`min(${shipComponents.ftlSpeed})::text`.as(
				"ftlSpeed",
			),
			sensorRange: sql<
				string | null
			>`max(${shipComponents.sensorRange})::text`.as("sensorRange"),
		})
		.from(shipDesignComponents)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.where(
			inArray(
				shipDesignComponents.shipDesignId,
				input.shipDesigns.map((d) => d.shipDesignId),
			),
		);

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
				mission: input.mission,
				position: originSystem.position,
				movementVector: null,
				constructionStarSystemId: originSystem.id,
				constructionDone: "0",
				constructionTotal: constructionTotal.toString(),
				constructionPerTick: "0",
				ftlSpeed: strategicStats?.ftlSpeed ?? null,
				sensorRange: strategicStats?.sensorRange ?? null,
				combatDeck: starterDeck,
				orders: [],
			})
			.returning();

		// Link assigned ship designs via junction table
		await tx.insert(taskForceShipDesigns).values(
			input.shipDesigns.map((designInput) => ({
				taskForceId: tf.id,
				shipDesignId: designInput.shipDesignId,
				quantity: designInput.quantity,
			})),
		);

		return [tf];
	});

	return { ...created, isVisible: true, lastUpdate: null };
};
