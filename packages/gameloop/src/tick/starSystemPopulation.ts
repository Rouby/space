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

export async function tickStarSystemPopulation(tx: Transaction, ctx: Context) {
	const starSystemsWithPopulations = await tx
		.select({
			id: starSystems.id,
			populations: sql<
				{ amount: number; allegianceToPlayerId: string }[]
			>`json_agg(json_build_object('amount', ${starSystemPopulations.amount}, 'allegianceToPlayerId', ${starSystemPopulations.allegianceToPlayerId}))`,
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

		const growthRatePerHour =
			0.05 * (1 - Math.log(Number(totalAmount) / 20_000_000_000 + 1));
		const growthRatePerTick = (growthRatePerHour / 3_600_000) * 100;

		const totalGrowth = Number(totalAmount) * growthRatePerTick;

		for (const pop of starSystem.populations) {
			const factor = pop.amount / Number(totalAmount);
			const amount = BigInt(pop.amount);
			const growth = BigInt(Math.floor(totalGrowth * factor));

			await tx
				.update(starSystemPopulations)
				.set({ amount: amount + growth })
				.where(eq(starSystemPopulations.starSystemId, starSystem.id));

			ctx.postMessage({
				type: "starSystem:populationChanged",
				starSystemId: starSystem.id,
				populationId: `${starSystem.id}:${pop.allegianceToPlayerId}`,
				amount: amount + growth,
				growth,
			});
		}
	}
}
