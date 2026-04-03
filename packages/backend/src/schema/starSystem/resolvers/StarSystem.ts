import {
	computeDevelopmentStanceProjection,
	defaultDevelopmentStance,
	getEffectiveCompletedProjectMaintenance,
	getIndustryBreakdown,
	getTotalCompletedProjectMaintenance,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	inArray,
	playerColonizationGovernances,
	playerColonizationPressureAllocations,
	players,
	starSystemColonizationPressures,
	starSystemDevelopmentStances,
	starSystemIndustrialProjects,
	starSystemPopulations,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import type { Context } from "../../../context.ts";
import type { StarSystemResolvers } from "./../../types.generated.js";

async function getResolvedIndustryBreakdown(
	parent: {
		id: string;
		gameId: string;
		industry?: number | null;
		ownerId?: string | null;
	},
	ctx: Context,
) {
	if (parent.industry === null || parent.industry === undefined) {
		return null;
	}

	const [populations, projects, colonizationAllocations] = await Promise.all([
		ctx.drizzle
			.select({ amount: starSystemPopulations.amount })
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, parent.id)),
		ctx.drizzle.query.starSystemIndustrialProjects.findMany({
			where: and(
				eq(starSystemIndustrialProjects.starSystemId, parent.id),
				eq(starSystemIndustrialProjects.gameId, parent.gameId),
			),
			columns: {
				projectType: true,
				maintenanceCost: true,
				completedAtTurn: true,
			},
		}),
		parent.ownerId
			? ctx.drizzle
					.select({
						industryCommitted:
							playerColonizationPressureAllocations.industryCommitted,
					})
					.from(playerColonizationPressureAllocations)
					.where(
						and(
							eq(playerColonizationPressureAllocations.gameId, parent.gameId),
							eq(playerColonizationPressureAllocations.ownerId, parent.ownerId),
							eq(
								playerColonizationPressureAllocations.sourceStarSystemId,
								parent.id,
							),
						),
					)
			: Promise.resolve([]),
	]);

	const totalPopulation = populations.reduce(
		(acc, population) => acc + population.amount,
		0n,
	);
	const maintenance = getTotalCompletedProjectMaintenance(projects);
	const colonizationAllocated = colonizationAllocations.reduce(
		(acc, allocation) => acc + allocation.industryCommitted,
		0,
	);

	return getIndustryBreakdown(
		parent.industry,
		totalPopulation,
		maintenance,
		colonizationAllocated,
	);
}

function withProjectEta<
	T extends { workRequired: number; workDone: number; industryPerTurn: number },
>(projects: T[]) {
	let cumulativeTurns = 0;

	return projects.map((project) => {
		const workLeft = Math.max(project.workRequired - project.workDone, 0);
		const turnsRemaining = Math.ceil(
			workLeft / Math.max(project.industryPerTurn, 1),
		);
		cumulativeTurns += turnsRemaining;

		return {
			...project,
			turnsRemaining,
			etaTurns: cumulativeTurns,
		};
	});
}
export const StarSystem: Pick<
	StarSystemResolvers,
	| "colonization"
	| "colonizationGovernance"
	| "colonizationPressureSources"
	| "completedIndustrialProjects"
	| "currentDevelopmentStance"
	| "discoveries"
	| "discoveryProgress"
	| "id"
	| "industrialProjects"
	| "industry"
	| "industryBreakdown"
	| "isVisible"
	| "lastUpdate"
	| "name"
	| "nextTurnStanceProjection"
	| "owner"
	| "populations"
	| "position"
	| "sensorRange"
	| "__isTypeOf"
> = {
	owner: async (parent, _arg, ctx) => {
		if (!parent.ownerId) {
			return null;
		}

		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, parent.ownerId),
				eq(players.gameId, parent.gameId),
			),
			with: { user: true },
		});

		if (!owner) {
			return null;
		}

		return owner;
	},
	sensorRange: async (parent, _arg, _ctx) => {
		return parent.ownerId ? 1000 : null;
	},
	discoveries: async (parent, _arg, ctx) => {
		if (parent.discoverySlots === null) {
			return null;
		}

		const resourceDiscoveries = await ctx.drizzle
			.select()
			.from(starSystemResourceDiscoveries)
			.where(eq(starSystemResourceDiscoveries.starSystemId, parent.id));

		return [
			...resourceDiscoveries.map((d) => ({
				__typename: "ResourceDiscovery" as const,
				...d,
			})),
			...Array.from({ length: parent.discoverySlots }, (_, idx) => ({
				__typename: "UnknownDiscovery" as const,
				id: `${parent.id}-unknown-${idx}`,
				discoveredAt: new Date(),
			})),
		]
			.slice(0, parent.discoverySlots)
			.sort((d1, d2) => d1.discoveredAt.getTime() - d2.discoveredAt.getTime());
	},
	populations: async (parent, _arg, ctx) => {
		if (!parent.isVisible) {
			return null;
		}
		return ctx.drizzle
			.select()
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, parent.id));
	},
	discoveryProgress: async (_parent, _arg, _ctx) => {
		return _parent.discoveryProgress === null
			? null
			: +_parent.discoveryProgress;
	},
	colonization: async (parent, _arg, ctx) => {
		const pressures =
			await ctx.drizzle.query.starSystemColonizationPressures.findMany({
				where: eq(starSystemColonizationPressures.starSystemId, parent.id),
			});

		if (pressures.length === 0) return null;

		// For the UI, we might want to show the highest pressure or the one belonging to the viewing player.
		// Since we want to expose this to the player who's accumulating it, let's find if the current user has pressure.
		const myPressure = pressures.find((p) => p.ownerId === ctx.userId);

		if (!myPressure) return null; // Or return highest if we want public visibility

		const accumulated = Number(myPressure.accumulatedPressure);
		const pressurePerTurn = Number(myPressure.pressurePerTurn);

		const ownerSystems = await ctx.drizzle.query.starSystems.findMany({
			where: and(
				eq(starSystems.ownerId, myPressure.ownerId),
				eq(starSystems.gameId, myPressure.gameId),
			),
			columns: { position: true },
		});

		let minDistance = Number.MAX_VALUE;
		for (const sys of ownerSystems) {
			const dist = Math.sqrt(
				(sys.position.x - parent.position.x) ** 2 +
					(sys.position.y - parent.position.y) ** 2,
			);
			if (dist < minDistance) {
				minDistance = dist;
			}
		}

		const threshold =
			minDistance === Number.MAX_VALUE ? 10 : 10 + minDistance / 50;

		const turnsRemaining =
			pressurePerTurn > 0
				? Math.ceil(Math.max(0, threshold - accumulated) / pressurePerTurn)
				: 999;

		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, myPressure.ownerId),
				eq(players.gameId, myPressure.gameId),
			),
			with: { user: true },
		});

		if (!owner) return null;

		return {
			player: owner,
			accumulated,
			threshold,
			pressurePerTurn,
			etaTurns: turnsRemaining,
		};
	},
	colonizationGovernance: async (parent, _arg, ctx) => {
		if (!ctx.userId) {
			return null;
		}

		const governance =
			await ctx.drizzle.query.playerColonizationGovernances.findFirst({
				where: and(
					eq(playerColonizationGovernances.starSystemId, parent.id),
					eq(playerColonizationGovernances.gameId, parent.gameId),
					eq(playerColonizationGovernances.ownerId, ctx.userId),
				),
				columns: { governance: true },
			});

		return governance?.governance ?? null;
	},
	colonizationPressureSources: async (parent, _arg, ctx) => {
		if (!ctx.userId || parent.ownerId) {
			return [];
		}

		const sourceSystems = await ctx.drizzle.query.starSystems.findMany({
			where: and(
				eq(starSystems.gameId, parent.gameId),
				eq(starSystems.ownerId, ctx.userId),
			),
			columns: {
				id: true,
				name: true,
				position: true,
				industry: true,
			},
		});

		if (sourceSystems.length === 0) {
			return [];
		}

		const sourceIds = sourceSystems.map((sourceSystem) => sourceSystem.id);

		const [populationRows, completedProjectRows, allocationRows] =
			await Promise.all([
				ctx.drizzle
					.select({
						starSystemId: starSystemPopulations.starSystemId,
						amount: starSystemPopulations.amount,
					})
					.from(starSystemPopulations)
					.where(
						and(
							eq(starSystemPopulations.allegianceToPlayerId, ctx.userId),
							inArray(starSystemPopulations.starSystemId, sourceIds),
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
							eq(starSystemIndustrialProjects.gameId, parent.gameId),
							inArray(starSystemIndustrialProjects.starSystemId, sourceIds),
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
							eq(playerColonizationPressureAllocations.gameId, parent.gameId),
							eq(playerColonizationPressureAllocations.ownerId, ctx.userId),
							inArray(
								playerColonizationPressureAllocations.sourceStarSystemId,
								sourceIds,
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

		const allocationBySourceId = new Map<string, number>();
		const allocationElsewhereBySourceId = new Map<string, number>();
		for (const row of allocationRows) {
			if (row.targetStarSystemId === parent.id) {
				allocationBySourceId.set(
					row.sourceStarSystemId,
					(allocationBySourceId.get(row.sourceStarSystemId) ?? 0) +
						row.industryCommitted,
				);
				continue;
			}

			allocationElsewhereBySourceId.set(
				row.sourceStarSystemId,
				(allocationElsewhereBySourceId.get(row.sourceStarSystemId) ?? 0) +
					row.industryCommitted,
			);
		}

		return sourceSystems
			.map((sourceSystem) => {
				const totalPopulation = populationBySourceId.get(sourceSystem.id) ?? 0n;
				const maintenance = getTotalCompletedProjectMaintenance(
					projectsBySourceId.get(sourceSystem.id) ?? [],
				);
				const availableIndustryBeforeAllocations = getIndustryBreakdown(
					sourceSystem.industry,
					totalPopulation,
					maintenance,
				).netIndustry;

				const dx = sourceSystem.position.x - parent.position.x;
				const dy = sourceSystem.position.y - parent.position.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const populationFactor = Math.min(
					Number(totalPopulation) / 1_000_000_000,
					1,
				);
				const distanceFactor = 1 / (1 + distance / 200);
				const allocatedIndustry =
					allocationBySourceId.get(sourceSystem.id) ?? 0;
				const allocatedElsewhere =
					allocationElsewhereBySourceId.get(sourceSystem.id) ?? 0;
				const availableIndustry = Math.max(
					availableIndustryBeforeAllocations - allocatedElsewhere,
					0,
				);
				const effectiveIndustry = Math.min(
					allocatedIndustry,
					availableIndustry,
				);

				return {
					sourceStarSystemId: sourceSystem.id,
					sourceStarSystemName: sourceSystem.name,
					distance,
					population: totalPopulation,
					availableIndustry,
					allocatedIndustry,
					populationFactor,
					distanceFactor,
					projectedPressurePerTurn:
						effectiveIndustry * populationFactor * distanceFactor,
				};
			})
			.sort((a, b) => a.distance - b.distance);
	},
	industry: async (parent, _arg, ctx) => {
		const breakdown = await getResolvedIndustryBreakdown(parent, ctx);
		return breakdown?.cappedIndustry ?? null;
	},
	industryBreakdown: async (parent, _arg, ctx) => {
		return getResolvedIndustryBreakdown(parent, ctx);
	},
	industrialProjects: async (parent, _arg, ctx) => {
		if (parent.industry === null) {
			return [];
		}

		const projects =
			await ctx.drizzle.query.starSystemIndustrialProjects.findMany({
				where: and(
					eq(starSystemIndustrialProjects.starSystemId, parent.id),
					eq(starSystemIndustrialProjects.gameId, parent.gameId),
				),
				orderBy: [starSystemIndustrialProjects.queuePosition],
			});

		const activeProjects = projects.filter(
			(project) => project.completedAtTurn === null,
		);
		return withProjectEta(activeProjects);
	},
	completedIndustrialProjects: async (parent, _arg, ctx) => {
		if (parent.industry === null) {
			return [];
		}

		const completedProjects =
			await ctx.drizzle.query.starSystemIndustrialProjects.findMany({
				where: and(
					eq(starSystemIndustrialProjects.starSystemId, parent.id),
					eq(starSystemIndustrialProjects.gameId, parent.gameId),
				),
				orderBy: [
					desc(starSystemIndustrialProjects.completedAtTurn),
					desc(starSystemIndustrialProjects.queuePosition),
				],
			});

		const finished = completedProjects.filter(
			(project) => project.completedAtTurn !== null,
		);

		return getEffectiveCompletedProjectMaintenance(finished).map((project) => ({
			...project,
			turnsRemaining: 0,
			etaTurns: 0,
		}));
	},
	currentDevelopmentStance: async (parent, _arg, ctx) => {
		if (!ctx.userId || !parent.ownerId || parent.ownerId !== ctx.userId) {
			return null;
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		const currentStance =
			await ctx.drizzle.query.starSystemDevelopmentStances.findFirst({
				where: and(
					eq(starSystemDevelopmentStances.gameId, parent.gameId),
					eq(starSystemDevelopmentStances.starSystemId, parent.id),
					eq(starSystemDevelopmentStances.turnNumber, game.turnNumber),
				),
				columns: { stance: true },
			});

		return currentStance?.stance ?? defaultDevelopmentStance;
	},
	nextTurnStanceProjection: async (parent, _arg, ctx) => {
		if (!ctx.userId || !parent.ownerId || parent.ownerId !== ctx.userId) {
			return null;
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		const currentStance =
			await ctx.drizzle.query.starSystemDevelopmentStances.findFirst({
				where: and(
					eq(starSystemDevelopmentStances.gameId, parent.gameId),
					eq(starSystemDevelopmentStances.starSystemId, parent.id),
					eq(starSystemDevelopmentStances.turnNumber, game.turnNumber),
				),
				columns: { stance: true },
			});

		const populations = await ctx.drizzle
			.select({
				amount: starSystemPopulations.amount,
				growthLeftover: starSystemPopulations.growthLeftover,
			})
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, parent.id));

		return computeDevelopmentStanceProjection(
			currentStance?.stance ?? defaultDevelopmentStance,
			populations,
			parent.industry,
		);
	},
};
