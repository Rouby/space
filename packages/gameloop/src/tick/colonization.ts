import {
	and,
	eq,
	isNotNull,
	isNull,
	playerColonizationGovernances,
	sql,
	starSystemColonizationPressures,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickColonization(tx: Transaction, ctx: Context) {
	const governanceRows = await tx
		.select()
		.from(playerColonizationGovernances)
		.where(eq(playerColonizationGovernances.gameId, gameId));

	const governanceByOwnerAndTarget = new Map(
		governanceRows.map((governance) => [
			`${governance.ownerId}-${governance.starSystemId}`,
			governance.governance,
		]),
	);

	// 1. Gather all owned systems with their total population.
	const populatedSystems = await tx
		.select({
			id: starSystems.id,
			ownerId: starSystems.ownerId,
			position: starSystems.position,
			totalPopulation:
				sql<bigint>`COALESCE(SUM(${starSystemPopulations.amount}), 0)`.as(
					"totalPopulation",
				),
		})
		.from(starSystems)
		.innerJoin(
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

	// 2. Filter base systems that can emit pressure (population > 1 Billion)
	const sourceSystems = populatedSystems.filter(
		(sys) => BigInt(sys.totalPopulation) > 1_000_000_000n,
	);

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

	if (targetSystems.length === 0 || sourceSystems.length === 0) {
		return;
	}

	// 4. Calculate pressure for each valid target from each source.
	// Data structure to accumulate total inflow for this turn per target per player
	const pressureInflow = new Map<
		string,
		{ targetId: string; ownerId: string; amount: number }
	>();

	const MAX_DISTANCE = 500;
	// Helper to calculate distance
	const distance = (
		p1: { x: number; y: number },
		p2: { x: number; y: number },
	) => {
		return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
	};

	for (const source of sourceSystems) {
		if (!source.ownerId) {
			continue;
		}

		// Outflow emit calculation
		const outflowAmount = Number(source.totalPopulation) / 1_000_000_000;

		// Find viable targets and calculate relative scores
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
			if (dist <= MAX_DISTANCE) {
				const scoreMultiplier = governance === "focus" ? 5 : 1;
				const score =
					((1 + target.discoverySlots) / Math.max(1, dist ** 2)) *
					scoreMultiplier;
				targetScores.set(target.id, score);
				totalScore += score;
			}
		}

		if (totalScore === 0) continue;

		// Distribute outflow based on score
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
		for (const source of sourceSystems.filter(
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
