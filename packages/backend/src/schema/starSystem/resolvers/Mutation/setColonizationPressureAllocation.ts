import {
	getIndustryBreakdown,
	getTotalCompletedProjectMaintenance,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	inArray,
	playerColonizationPressureAllocations,
	players,
	starSystemIndustrialProjects,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

export const setColonizationPressureAllocation: NonNullable<
	MutationResolvers["setColonizationPressureAllocation"]
> = async (_parent, { targetStarSystemId, allocations }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const targetStarSystem = await ctx.drizzle.query.starSystems.findFirst({
		where: eq(starSystems.id, targetStarSystemId),
	});

	if (!targetStarSystem) {
		throw createGraphQLError("Star system not found", {
			extensions: { code: "NOT_FOUND" },
		});
	}

	if (targetStarSystem.ownerId) {
		throw createGraphQLError(
			"Colonization pressure can only target unowned systems",
			{
				extensions: { code: "INVALID_TARGET" },
			},
		);
	}

	const membership = await ctx.drizzle.query.players.findFirst({
		where: and(
			eq(players.gameId, targetStarSystem.gameId),
			eq(players.userId, context.userId),
		),
	});

	if (!membership) {
		context.denyAccess({
			message: "Not authorized to set colonization pressure in this game",
			code: "NOT_AUTHORIZED",
			reason: "set-colonization-pressure-not-member",
			details: { gameId: targetStarSystem.gameId, targetStarSystemId },
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, targetStarSystem.gameId),
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

	const normalizedBySourceId = new Map<string, number>();
	for (const allocation of allocations) {
		if (!Number.isInteger(allocation.industryCommitted)) {
			throw createGraphQLError("Industry committed must be an integer", {
				extensions: { code: "INVALID_INDUSTRY_VALUE" },
			});
		}

		if (allocation.industryCommitted < 0) {
			throw createGraphQLError(
				"Industry committed must be greater than or equal to zero",
				{
					extensions: { code: "INVALID_INDUSTRY_VALUE" },
				},
			);
		}

		normalizedBySourceId.set(
			allocation.sourceStarSystemId,
			(normalizedBySourceId.get(allocation.sourceStarSystemId) ?? 0) +
				allocation.industryCommitted,
		);
	}

	const sourceStarSystemIds = Array.from(normalizedBySourceId.keys());
	if (sourceStarSystemIds.length > 0) {
		const sourceStarSystems = await ctx.drizzle.query.starSystems.findMany({
			where: and(
				eq(starSystems.gameId, targetStarSystem.gameId),
				eq(starSystems.ownerId, context.userId),
				inArray(starSystems.id, sourceStarSystemIds),
			),
			columns: { id: true, industry: true },
		});

		const ownedSourceIds = new Set(
			sourceStarSystems.map((source) => source.id),
		);
		for (const sourceStarSystemId of sourceStarSystemIds) {
			if (!ownedSourceIds.has(sourceStarSystemId)) {
				throw createGraphQLError(
					"Source systems must be owned by the current player",
					{
						extensions: {
							code: "INVALID_SOURCE_SYSTEM",
							sourceStarSystemId,
						},
					},
				);
			}
		}

		const [populationRows, completedProjectRows, existingAllocationRows] =
			await Promise.all([
				ctx.drizzle
					.select({
						starSystemId: starSystemPopulations.starSystemId,
						amount: starSystemPopulations.amount,
					})
					.from(starSystemPopulations)
					.where(
						and(
							eq(starSystemPopulations.allegianceToPlayerId, context.userId),
							inArray(starSystemPopulations.starSystemId, sourceStarSystemIds),
						),
					),
				ctx.drizzle
					.select({
						starSystemId: starSystemIndustrialProjects.starSystemId,
						id: starSystemIndustrialProjects.id,
						projectType: starSystemIndustrialProjects.projectType,
						maintenanceCost: starSystemIndustrialProjects.maintenanceCost,
						completedAtTurn: starSystemIndustrialProjects.completedAtTurn,
						queuePosition: starSystemIndustrialProjects.queuePosition,
					})
					.from(starSystemIndustrialProjects)
					.where(
						and(
							eq(starSystemIndustrialProjects.gameId, targetStarSystem.gameId),
							inArray(
								starSystemIndustrialProjects.starSystemId,
								sourceStarSystemIds,
							),
						),
					),
				ctx.drizzle
					.select({
						sourceStarSystemId:
							playerColonizationPressureAllocations.sourceStarSystemId,
						targetStarSystemId:
							playerColonizationPressureAllocations.targetStarSystemId,
						industryCommitted:
							playerColonizationPressureAllocations.industryCommitted,
					})
					.from(playerColonizationPressureAllocations)
					.where(
						and(
							eq(
								playerColonizationPressureAllocations.gameId,
								targetStarSystem.gameId,
							),
							eq(playerColonizationPressureAllocations.ownerId, context.userId),
							inArray(
								playerColonizationPressureAllocations.sourceStarSystemId,
								sourceStarSystemIds,
							),
						),
					),
			]);

		const populationBySourceId = new Map<string, bigint>();
		for (const row of populationRows) {
			populationBySourceId.set(
				row.starSystemId,
				(populationBySourceId.get(row.starSystemId) ?? 0n) + row.amount,
			);
		}

		const projectsBySourceId = new Map<string, typeof completedProjectRows>();
		for (const row of completedProjectRows) {
			const existing = projectsBySourceId.get(row.starSystemId) ?? [];
			existing.push(row);
			projectsBySourceId.set(row.starSystemId, existing);
		}

		const committedToOtherTargetsBySourceId = new Map<string, number>();
		for (const row of existingAllocationRows) {
			if (row.targetStarSystemId === targetStarSystemId) {
				continue;
			}

			committedToOtherTargetsBySourceId.set(
				row.sourceStarSystemId,
				(committedToOtherTargetsBySourceId.get(row.sourceStarSystemId) ?? 0) +
					row.industryCommitted,
			);
		}

		for (const sourceStarSystem of sourceStarSystems) {
			const totalPopulation =
				populationBySourceId.get(sourceStarSystem.id) ?? 0n;
			const maintenance = getTotalCompletedProjectMaintenance(
				projectsBySourceId.get(sourceStarSystem.id) ?? [],
			);
			const availableIndustry = getIndustryBreakdown(
				sourceStarSystem.industry,
				totalPopulation,
				maintenance,
			).netIndustry;

			const committedElsewhere =
				committedToOtherTargetsBySourceId.get(sourceStarSystem.id) ?? 0;
			const maxForTarget = Math.max(availableIndustry - committedElsewhere, 0);
			const committedToTarget =
				normalizedBySourceId.get(sourceStarSystem.id) ?? 0;

			if (committedToTarget > maxForTarget) {
				throw createGraphQLError(
					"Allocated colonization industry exceeds available source capacity",
					{
						extensions: {
							code: "INDUSTRY_OVERCOMMITTED",
							sourceStarSystemId: sourceStarSystem.id,
							availableIndustry: maxForTarget,
							requestedIndustry: committedToTarget,
						},
					},
				);
			}
		}
	}

	await ctx.drizzle.transaction(async (tx) => {
		await tx
			.delete(playerColonizationPressureAllocations)
			.where(
				and(
					eq(
						playerColonizationPressureAllocations.gameId,
						targetStarSystem.gameId,
					),
					eq(playerColonizationPressureAllocations.ownerId, context.userId),
					eq(
						playerColonizationPressureAllocations.targetStarSystemId,
						targetStarSystemId,
					),
				),
			);

		const nextAllocations = Array.from(normalizedBySourceId.entries())
			.filter(([, industryCommitted]) => industryCommitted > 0)
			.map(([sourceStarSystemId, industryCommitted]) => ({
				gameId: targetStarSystem.gameId,
				ownerId: context.userId,
				targetStarSystemId,
				sourceStarSystemId,
				industryCommitted,
			}));

		if (nextAllocations.length > 0) {
			await tx
				.insert(playerColonizationPressureAllocations)
				.values(nextAllocations);
		}
	});

	return {
		...targetStarSystem,
		isVisible: true,
		lastUpdate: null,
	};
};
