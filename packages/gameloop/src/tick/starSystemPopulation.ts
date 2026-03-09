import {
	and,
	eq,
	isNotNull,
	sql,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import { getPopulationGrowthRatePerRound } from "./economyBalance.ts";
import type { Context, Transaction } from "./tick.ts";

export type PopulationTurnChange = {
	starSystemId: string;
	populationId: string;
	previousAmount: bigint;
	newAmount: bigint;
	growth: bigint;
};

export async function tickStarSystemPopulation(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const starSystemsWithPopulations = await tx
		.select({
			id: starSystems.id,
			populations: sql<
				{
					amount: number;
					allegianceToPlayerId: string;
					growthLeftover: number;
				}[]
			>`json_agg(json_build_object('amount', ${starSystemPopulations.amount}, 'allegianceToPlayerId', ${starSystemPopulations.allegianceToPlayerId}, 'growthLeftover', ${starSystemPopulations.growthLeftover}))`,
		})
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.innerJoin(
			starSystemPopulations,
			eq(starSystemPopulations.starSystemId, starSystems.id),
		)
		.groupBy(starSystems.id);

	for (const starSystem of starSystemsWithPopulations) {
		const totalAmount = starSystem.populations.reduce(
			(acc, pop) => acc + BigInt(pop.amount),
			0n,
		);

		const growthRatePerRound = getPopulationGrowthRatePerRound(
			Number(totalAmount),
		);

		const totalGrowth = Number(totalAmount) * growthRatePerRound;

		for (const pop of starSystem.populations) {
			const factor = pop.amount / Number(totalAmount);
			const amount = BigInt(pop.amount);
			const growth = totalGrowth * factor + pop.growthLeftover;
			const growthInt = BigInt(Math.floor(growth));

			await tx
				.update(starSystemPopulations)
				.set({
					amount: amount + growthInt,
					growthLeftover: `${growth - Number(growthInt)}`,
				})
				.where(
					and(
						eq(starSystemPopulations.starSystemId, starSystem.id),
						eq(
							starSystemPopulations.allegianceToPlayerId,
							pop.allegianceToPlayerId,
						),
					),
				);

			if (growthInt > 0n) {
				ctx.addPopulationChange({
					starSystemId: starSystem.id,
					populationId: `${starSystem.id}:${pop.allegianceToPlayerId}`,
					previousAmount: amount,
					newAmount: amount + growthInt,
					growth: growthInt,
				});

				ctx.postMessage({
					type: "starSystem:populationChanged",
					id: starSystem.id,
					populationId: `${starSystem.id}:${pop.allegianceToPlayerId}`,
					amount: amount + growthInt,
					growthPerTick: growthInt,
				});
			}
		}
	}
}
