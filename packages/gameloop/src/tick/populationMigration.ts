import {
	and,
	eq,
	isNotNull,
	sql,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

type Position = { x: number; y: number };

type SystemPopulation = {
	allegianceToPlayerId: string;
	amount: number;
};

type MigrationSystem = {
	id: string;
	ownerId: string;
	position: Position;
	industry: number;
	discoverySlots: number;
	totalPopulation: number;
	populations: SystemPopulation[];
};

export type PlannedMigration = {
	sourceStarSystemId: string;
	destinationStarSystemId: string;
	allegianceToPlayerId: string;
	amount: bigint;
};

const MAX_MIGRATION_DISTANCE = 700;
const BASE_MIGRATION_RATE_PER_TURN = 0.00015;
const MIN_MIGRATION_BATCH = 1_000n;

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function distance(a: Position, b: Position) {
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

function getCarryingCapacity(
	system: Pick<MigrationSystem, "industry" | "discoverySlots">,
) {
	return (
		900_000_000 +
		system.industry * 300_000_000 +
		system.discoverySlots * 180_000_000
	);
}

function calculateOutflow(system: MigrationSystem): bigint {
	if (system.totalPopulation <= 0) {
		return 0n;
	}

	const carryingCapacity = getCarryingCapacity(system);
	const density = system.totalPopulation / carryingCapacity;
	const scarcity =
		1 /
		(1 +
			Math.max(0, system.industry) +
			Math.max(0, system.discoverySlots) * 1.5);
	const pressure = clamp((density - 1) * 0.8 + scarcity * 0.6, 0, 1.5);
	const outflow = Math.floor(
		system.totalPopulation * BASE_MIGRATION_RATE_PER_TURN * pressure,
	);
	return BigInt(Math.max(0, outflow));
}

function scoreDestination(
	source: MigrationSystem,
	destination: MigrationSystem,
): number {
	const dist = distance(source.position, destination.position);
	if (dist > MAX_MIGRATION_DISTANCE || dist <= 0) {
		return 0;
	}

	const carryingCapacity = getCarryingCapacity(destination);
	const density = destination.totalPopulation / carryingCapacity;
	const economicOpportunity =
		(1 + destination.industry * 0.4 + destination.discoverySlots * 0.9) /
		(1 + density * 1.2);
	const distancePenalty = 1 + (dist / 220) ** 2;
	return Math.max(0, economicOpportunity / distancePenalty);
}

function distributeByWeight<T extends string>(
	total: bigint,
	entries: Array<{ key: T; weight: number }>,
): Map<T, bigint> {
	const filtered = entries
		.filter((entry) => entry.weight > 0)
		.sort((a, b) => a.key.localeCompare(b.key));
	const totalWeight = filtered.reduce((sum, entry) => sum + entry.weight, 0);
	const result = new Map<T, bigint>();

	if (total <= 0n || totalWeight <= 0 || filtered.length === 0) {
		return result;
	}

	let remaining = total;
	for (const [index, entry] of filtered.entries()) {
		if (index === filtered.length - 1) {
			if (remaining > 0n) {
				result.set(entry.key, remaining);
			}
			break;
		}

		const share = BigInt(
			Math.floor(Number(total) * (entry.weight / totalWeight)),
		);
		if (share > 0n) {
			result.set(entry.key, share);
			remaining -= share;
		}
	}

	return result;
}

function splitAcrossAllegiances(
	total: bigint,
	populations: SystemPopulation[],
): Map<string, bigint> {
	const sorted = [...populations].sort((a, b) =>
		a.allegianceToPlayerId.localeCompare(b.allegianceToPlayerId),
	);
	const totalPopulation = sorted.reduce(
		(sum, pop) => sum + BigInt(pop.amount),
		0n,
	);
	const distribution = new Map<string, bigint>();

	if (totalPopulation <= 0n || total <= 0n) {
		return distribution;
	}

	let remaining = total;
	for (const [index, pop] of sorted.entries()) {
		if (index === sorted.length - 1) {
			if (remaining > 0n) {
				distribution.set(pop.allegianceToPlayerId, remaining);
			}
			break;
		}

		const amount = BigInt(pop.amount);
		const share = (total * amount) / totalPopulation;
		if (share > 0n) {
			distribution.set(pop.allegianceToPlayerId, share);
			remaining -= share;
		}
	}

	return distribution;
}

export function planPopulationMigrations(
	systems: MigrationSystem[],
): PlannedMigration[] {
	const moves: PlannedMigration[] = [];
	const systemById = new Map(systems.map((system) => [system.id, system]));

	for (const source of systems) {
		const outflow = calculateOutflow(source);
		if (outflow < MIN_MIGRATION_BATCH) {
			continue;
		}

		const targets = systems
			.filter((destination) => destination.id !== source.id)
			.map((destination) => ({
				destination,
				score: scoreDestination(source, destination),
			}))
			.filter(({ score }) => score > 0);

		if (targets.length === 0) {
			continue;
		}

		const destinationShares = distributeByWeight(
			outflow,
			targets.map(({ destination, score }) => ({
				key: destination.id,
				weight: score,
			})),
		);
		const allegianceTotals = splitAcrossAllegiances(
			outflow,
			source.populations,
		);
		const destinationWeights = targets.map(({ destination, score }) => ({
			key: destination.id,
			weight: score,
		}));

		for (const [
			allegianceToPlayerId,
			allegianceAmount,
		] of allegianceTotals.entries()) {
			if (allegianceAmount <= 0n) {
				continue;
			}

			const perDestination = distributeByWeight(
				allegianceAmount,
				destinationWeights,
			);

			for (const [destinationId, amount] of perDestination.entries()) {
				if (amount <= 0n) {
					continue;
				}

				const destination = systemById.get(destinationId);
				if (!destination) {
					continue;
				}

				moves.push({
					sourceStarSystemId: source.id,
					destinationStarSystemId: destination.id,
					allegianceToPlayerId,
					amount,
				});
			}
		}

		const plannedOutflow = Array.from(destinationShares.values()).reduce(
			(sum, amount) => sum + amount,
			0n,
		);
		if (plannedOutflow !== outflow) {
			throw new Error("Population migration planning invariant violated");
		}
	}

	return moves;
}

export async function tickPopulationMigration(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const systemsWithPopulations = await tx
		.select({
			id: starSystems.id,
			ownerId: starSystems.ownerId,
			position: starSystems.position,
			industry: starSystems.industry,
			discoverySlots: starSystems.discoverySlots,
			totalPopulation:
				sql<number>`COALESCE(SUM(${starSystemPopulations.amount}), 0)`.as(
					"totalPopulation",
				),
			populations: sql<
				SystemPopulation[]
			>`json_agg(json_build_object('allegianceToPlayerId', ${starSystemPopulations.allegianceToPlayerId}, 'amount', ${starSystemPopulations.amount}))`,
		})
		.from(starSystems)
		.innerJoin(
			starSystemPopulations,
			eq(starSystemPopulations.starSystemId, starSystems.id),
		)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.groupBy(starSystems.id);

	const systems: MigrationSystem[] = systemsWithPopulations
		.filter((system): system is typeof system & { ownerId: string } =>
			Boolean(system.ownerId),
		)
		.map((system) => ({
			id: system.id,
			ownerId: system.ownerId,
			position: system.position,
			industry: system.industry,
			discoverySlots: system.discoverySlots,
			totalPopulation: system.totalPopulation,
			populations: system.populations,
		}));

	if (systems.length < 2) {
		return;
	}

	const plannedMoves = planPopulationMigrations(systems);
	if (plannedMoves.length === 0) {
		return;
	}

	const sourceByKey = new Map<string, bigint>();
	const destinationByKey = new Map<string, bigint>();
	const sourceRows = new Map<string, bigint>();

	for (const system of systems) {
		for (const population of system.populations) {
			sourceRows.set(
				`${system.id}:${population.allegianceToPlayerId}`,
				BigInt(population.amount),
			);
		}
	}

	for (const move of plannedMoves) {
		const sourceKey = `${move.sourceStarSystemId}:${move.allegianceToPlayerId}`;
		const destinationKey = `${move.destinationStarSystemId}:${move.allegianceToPlayerId}`;
		sourceByKey.set(
			sourceKey,
			(sourceByKey.get(sourceKey) ?? 0n) + move.amount,
		);
		destinationByKey.set(
			destinationKey,
			(destinationByKey.get(destinationKey) ?? 0n) + move.amount,
		);
	}

	const totalOut = Array.from(sourceByKey.values()).reduce(
		(sum, value) => sum + value,
		0n,
	);
	const totalIn = Array.from(destinationByKey.values()).reduce(
		(sum, value) => sum + value,
		0n,
	);
	if (totalOut !== totalIn) {
		throw new Error(
			"Population migration invariant violated: outflow != inflow",
		);
	}

	for (const [key, deduction] of sourceByKey.entries()) {
		const [starSystemId, allegianceToPlayerId] = key.split(":");
		if (!starSystemId || !allegianceToPlayerId) {
			continue;
		}

		const currentAmount = sourceRows.get(key) ?? 0n;
		const nextAmount = currentAmount - deduction;

		if (nextAmount <= 0n) {
			await tx
				.delete(starSystemPopulations)
				.where(
					and(
						eq(starSystemPopulations.starSystemId, starSystemId),
						eq(
							starSystemPopulations.allegianceToPlayerId,
							allegianceToPlayerId,
						),
					),
				);
		} else {
			await tx
				.update(starSystemPopulations)
				.set({ amount: nextAmount })
				.where(
					and(
						eq(starSystemPopulations.starSystemId, starSystemId),
						eq(
							starSystemPopulations.allegianceToPlayerId,
							allegianceToPlayerId,
						),
					),
				);
		}
	}

	for (const [key, addition] of destinationByKey.entries()) {
		const [starSystemId, allegianceToPlayerId] = key.split(":");
		if (!starSystemId || !allegianceToPlayerId || addition <= 0n) {
			continue;
		}

		await tx
			.insert(starSystemPopulations)
			.values({
				starSystemId,
				allegianceToPlayerId,
				amount: addition,
			})
			.onConflictDoUpdate({
				target: [
					starSystemPopulations.starSystemId,
					starSystemPopulations.allegianceToPlayerId,
				],
				set: {
					amount: sql`${starSystemPopulations.amount} + ${addition}`,
				},
			});
	}

	for (const move of plannedMoves) {
		ctx.addPopulationMigrationChange?.({
			sourceStarSystemId: move.sourceStarSystemId,
			destinationStarSystemId: move.destinationStarSystemId,
			allegianceToPlayerId: move.allegianceToPlayerId,
			amount: move.amount.toString(),
		});
	}
}
