import {
	getIndustryBreakdown,
	getTotalCompletedProjectMaintenance,
} from "@space/data/functions";
import {
	and,
	eq,
	inArray,
	isNotNull,
	isNull,
	playerColonizationGovernances,
	playerColonizationPressureAllocations,
	sql,
	starSystemColonizationPressures,
	starSystemIndustrialProjects,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

const MAX_PASSIVE_DISTANCE = 500;
const DIRECTED_DISTANCE_FALLOFF = 200;

const distance = (
	p1: { x: number; y: number },
	p2: { x: number; y: number },
) => {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

const getDistanceFactor = (distanceValue: number) => {
	return 1 / (1 + distanceValue / DIRECTED_DISTANCE_FALLOFF);
};

const getPopulationFactor = (totalPopulation: number) => {
	return Math.min(Math.max(totalPopulation, 0) / 1_000_000_000, 1);
};

export async function tickColonization(tx: Transaction, ctx: Context) {
	const governanceRows = await tx
		.select()
		.from(playerColonizationGovernances)
		.where(eq(playerColonizationGovernances.gameId, gameId));

	const pressureAllocationRows = await tx
		.select()
		.from(playerColonizationPressureAllocations)
		.where(eq(playerColonizationPressureAllocations.gameId, gameId));

	const governanceByOwnerAndTarget = new Map(
		governanceRows.map((governance) => [
			`${governance.ownerId}-${governance.starSystemId}`,
			governance.governance,
		]),
	);

	// 1. Gather all owned systems with their total population.
	const ownedSystems = await tx
		.select({
			id: starSystems.id,
			ownerId: starSystems.ownerId,
			position: starSystems.position,
			industry: starSystems.industry,
			totalPopulation:
				sql<bigint>`COALESCE(SUM(${starSystemPopulations.amount}), 0)`.as(
					"totalPopulation",
				),
		})
		.from(starSystems)
		.leftJoin(
			starSystemPopulations,
			eq(starSystemPopulations.starSystemId, starSystems.id),
		)
		.where(
			and(
				eq(starSystems.gameId, gameId),
				isNotNull(starSystems.ownerId), // Only owned systems
			),
		)
		.groupBy(starSystems.id);

	// 3. Find unowned target systems.
	const targetSystems = await tx
		.select({
			id: starSystems.id,
			position: starSystems.position,
			discoverySlots: starSystems.discoverySlots,
		})
		.from(starSystems)
		.where(
			and(
				eq(starSystems.gameId, gameId),
				isNull(starSystems.ownerId), // Unowned systems
			),
		);

	if (targetSystems.length === 0 || ownedSystems.length === 0) {
		return;
	}

	const sourceSystemIds = ownedSystems.map((sourceSystem) => sourceSystem.id);

	const completedProjects = sourceSystemIds.length
		? await tx
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
						eq(starSystemIndustrialProjects.gameId, gameId),
						inArray(starSystemIndustrialProjects.starSystemId, sourceSystemIds),
					),
				)
		: [];

	const completedProjectsBySource = new Map<string, typeof completedProjects>();
	for (const project of completedProjects) {
		if (!sourceSystemIds.includes(project.starSystemId)) {
			continue;
		}

		const existing = completedProjectsBySource.get(project.starSystemId) ?? [];
		existing.push(project);
		completedProjectsBySource.set(project.starSystemId, existing);
	}

	const targetSystemsById = new Map(
		targetSystems.map((targetSystem) => [targetSystem.id, targetSystem]),
	);

	const allocationsByOwnerAndSource = new Map<
		string,
		typeof pressureAllocationRows
	>();
	for (const row of pressureAllocationRows) {
		const key = `${row.ownerId}-${row.sourceStarSystemId}`;
		const existing = allocationsByOwnerAndSource.get(key) ?? [];
		existing.push(row);
		allocationsByOwnerAndSource.set(key, existing);
	}

	// 4. Calculate pressure for each valid target from each source.
	// Data structure to accumulate total inflow for this turn per target per player
	const pressureInflow = new Map<
		string,
		{ targetId: string; ownerId: string; amount: number }
	>();

	for (const source of ownedSystems) {
		if (!source.ownerId) {
			continue;
		}

		const totalPopulation = Number(source.totalPopulation);
		const maintenance = getTotalCompletedProjectMaintenance(
			completedProjectsBySource.get(source.id) ?? [],
		);
		const availableIndustry = getIndustryBreakdown(
			source.industry,
			totalPopulation,
			maintenance,
		).netIndustry;

		// Passive pressure (existing behavior) for large populations.
		if (totalPopulation > 1_000_000_000) {
			const outflowAmount = totalPopulation / 1_000_000_000;

			let totalScore = 0;
			const targetScores = new Map<string, number>();

			for (const target of targetSystems) {
				const governance = governanceByOwnerAndTarget.get(
					`${source.ownerId}-${target.id}`,
				);
				if (governance === "forbid") {
					continue;
				}

				const dist = distance(source.position, target.position);
				if (dist <= MAX_PASSIVE_DISTANCE) {
					const scoreMultiplier = governance === "focus" ? 5 : 1;
					const score =
						((1 + target.discoverySlots) / Math.max(1, dist ** 2)) *
						scoreMultiplier;
					targetScores.set(target.id, score);
					totalScore += score;
				}
			}

			if (totalScore > 0) {
				for (const [targetId, score] of targetScores.entries()) {
					const fraction = score / totalScore;
					const pressureApplied = outflowAmount * fraction;
					if (pressureApplied <= 0) continue;

					const key = `${targetId}-${source.ownerId}`;
					const existing = pressureInflow.get(key);
					if (existing) {
						existing.amount += pressureApplied;
					} else {
						pressureInflow.set(key, {
							targetId,
							ownerId: source.ownerId,
							amount: pressureApplied,
						});
					}
				}
			}
		}

		// Directed pressure from explicit player allocations.
		if (availableIndustry <= 0) {
			continue;
		}

		const allocationsForSource =
			allocationsByOwnerAndSource.get(`${source.ownerId}-${source.id}`) ?? [];
		if (allocationsForSource.length === 0) {
			continue;
		}

		const validAllocations = allocationsForSource
			.filter((allocation) => allocation.industryCommitted > 0)
			.map((allocation) => {
				const target = targetSystemsById.get(allocation.targetStarSystemId);
				if (!target) {
					return null;
				}

				return {
					target,
					industryCommitted: allocation.industryCommitted,
				};
			})
			.filter(
				(
					allocation,
				): allocation is {
					target: (typeof targetSystems)[number];
					industryCommitted: number;
				} => allocation !== null,
			);

		if (validAllocations.length === 0) {
			continue;
		}

		const totalRequestedIndustry = validAllocations.reduce(
			(sum, allocation) => sum + allocation.industryCommitted,
			0,
		);

		if (totalRequestedIndustry <= 0) {
			continue;
		}

		const industryScale = Math.min(
			1,
			availableIndustry / totalRequestedIndustry,
		);
		const populationFactor = getPopulationFactor(totalPopulation);

		for (const allocation of validAllocations) {
			const effectiveIndustry = allocation.industryCommitted * industryScale;
			if (effectiveIndustry <= 0) {
				continue;
			}

			const dist = distance(source.position, allocation.target.position);
			const distanceFactor = getDistanceFactor(dist);
			const pressureApplied =
				effectiveIndustry * populationFactor * distanceFactor;
			if (pressureApplied <= 0) {
				continue;
			}

			const key = `${allocation.target.id}-${source.ownerId}`;
			const existing = pressureInflow.get(key);
			if (existing) {
				existing.amount += pressureApplied;
			} else {
				pressureInflow.set(key, {
					targetId: allocation.target.id,
					ownerId: source.ownerId,
					amount: pressureApplied,
				});
			}
		}
	}

	if (pressureInflow.size === 0) {
		return;
	}

	// 5. Apply the pressure and check thresholds
	// Load current pressures from DB
	const existingPressures = await tx
		.select()
		.from(starSystemColonizationPressures)
		.where(eq(starSystemColonizationPressures.gameId, gameId));

	const pressuresByTargetAndOwner = new Map(
		existingPressures.map((p) => [`${p.starSystemId}-${p.ownerId}`, p]),
	);
	const colonizedTargetIds = new Set<string>();

	for (const inflow of pressureInflow.values()) {
		if (colonizedTargetIds.has(inflow.targetId)) {
			continue;
		}

		const key = `${inflow.targetId}-${inflow.ownerId}`;
		let currentAccumulated = 0;

		const existing = pressuresByTargetAndOwner.get(key);
		if (existing) {
			currentAccumulated = Number(existing.accumulatedPressure);
		}

		const newAccumulated = currentAccumulated + inflow.amount;

		// Determine the nearest owned system for this player to calculate threshold
		// We can quickly estimate threshold based on minimum distance to an owned system
		let minDistance = Number.MAX_VALUE;
		const targetSys = targetSystems.find((t) => t.id === inflow.targetId);
		if (!targetSys) {
			continue;
		}
		for (const source of ownedSystems.filter(
			(s) => s.ownerId === inflow.ownerId,
		)) {
			const dist = distance(source.position, targetSys.position);
			if (dist < minDistance) {
				minDistance = dist;
			}
		}

		const threshold = 10 + minDistance / 50;

		if (newAccumulated >= threshold) {
			// System successfully colonized!
			colonizedTargetIds.add(inflow.targetId);

			const [updatedStarSystem] = await tx
				.update(starSystems)
				.set({ ownerId: inflow.ownerId })
				.where(
					and(
						eq(starSystems.id, inflow.targetId),
						eq(starSystems.gameId, gameId),
					),
				)
				.returning({ id: starSystems.id, ownerId: starSystems.ownerId });

			// Initial colonist population based on scientific consensus
			// (e.g., genetic diversity & minimum viable population for interstellar settlement roughly 10k-50k)
			const initialPopulation = BigInt(
				Math.floor(Math.random() * 40000) + 10000,
			);

			const contributors = new Map<string, number>();
			for (const pressure of existingPressures) {
				if (pressure.starSystemId !== inflow.targetId) {
					continue;
				}

				const storedPressure = Number(pressure.accumulatedPressure);
				if (storedPressure > 0) {
					contributors.set(pressure.ownerId, storedPressure);
				}
			}

			// Use post-inflow pressure for the threshold breaker at settlement time.
			if (newAccumulated > 0) {
				contributors.set(inflow.ownerId, newAccumulated);
			}

			const contributorEntries = Array.from(contributors.entries())
				.filter(([, accumulatedPressure]) => accumulatedPressure > 0)
				.sort(([ownerA], [ownerB]) => ownerA.localeCompare(ownerB));

			const totalAccumulated = contributorEntries.reduce(
				(sum, [, accumulatedPressure]) => sum + accumulatedPressure,
				0,
			);

			if (contributorEntries.length > 0 && totalAccumulated > 0) {
				const populationRows: Array<{
					starSystemId: string;
					allegianceToPlayerId: string;
					amount: bigint;
				}> = [];

				let remainingPopulation = initialPopulation;
				for (const [
					index,
					[ownerId, accumulatedPressure],
				] of contributorEntries.entries()) {
					if (index === contributorEntries.length - 1) {
						populationRows.push({
							starSystemId: inflow.targetId,
							allegianceToPlayerId: ownerId,
							amount: remainingPopulation,
						});
						continue;
					}

					const shareFloat =
						Number(initialPopulation) *
						(accumulatedPressure / totalAccumulated);
					const share = BigInt(Math.floor(shareFloat));
					populationRows.push({
						starSystemId: inflow.targetId,
						allegianceToPlayerId: ownerId,
						amount: share,
					});
					remainingPopulation -= share;
				}

				await tx.insert(starSystemPopulations).values(populationRows);
			}

			// Delete all pressure records for this system since it's now owned
			await tx
				.delete(starSystemColonizationPressures)
				.where(
					eq(starSystemColonizationPressures.starSystemId, inflow.targetId),
				);

			await tx
				.delete(playerColonizationPressureAllocations)
				.where(
					eq(
						playerColonizationPressureAllocations.targetStarSystemId,
						inflow.targetId,
					),
				);

			if (updatedStarSystem?.ownerId) {
				ctx.postMessage({
					type: "starSystem:ownerChanged",
					id: updatedStarSystem.id,
					ownerId: updatedStarSystem.ownerId,
				});
				if (ctx.addColonizationCompleted) {
					ctx.addColonizationCompleted({
						starSystemId: inflow.targetId,
						accumulatedPressure: newAccumulated.toString(),
						pressureThreshold: threshold.toString(),
					});
				}
			}
		} else {
			// Upsert pressure record
			await tx
				.insert(starSystemColonizationPressures)
				.values({
					starSystemId: inflow.targetId,
					ownerId: inflow.ownerId,
					gameId: gameId,
					accumulatedPressure: newAccumulated.toString(),
					pressurePerTurn: inflow.amount.toString(),
				})
				.onConflictDoUpdate({
					target: [
						starSystemColonizationPressures.starSystemId,
						starSystemColonizationPressures.ownerId,
					],
					set: {
						accumulatedPressure: newAccumulated.toString(),
						pressurePerTurn: inflow.amount.toString(),
					},
				});

			if (ctx.addColonizationPressureChange) {
				ctx.addColonizationPressureChange({
					starSystemId: inflow.targetId,
					pressureAdded: inflow.amount.toString(),
					accumulatedPressure: newAccumulated.toString(),
					pressureThreshold: threshold.toString(),
				});
			}

			// Post progress event
			ctx.postMessage({
				type: "starSystem:colonizationProgress",
				id: inflow.targetId,
				turnsRemaining: Math.ceil(
					Math.max(0, threshold - newAccumulated) / inflow.amount,
				),
			});
		}
	}
}
