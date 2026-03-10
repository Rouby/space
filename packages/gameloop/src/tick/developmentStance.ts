import {
	defaultDevelopmentStance,
	getDevelopmentStanceEffect,
} from "@space/data/functions";
import {
	and,
	eq,
	isNotNull,
	starSystemDevelopmentStances,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickDevelopmentStances(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const systems = await tx
		.select({
			id: starSystems.id,
			industry: starSystems.industry,
		})
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)));

	if (systems.length === 0) {
		return;
	}

	const stances = await tx
		.select({
			starSystemId: starSystemDevelopmentStances.starSystemId,
			stance: starSystemDevelopmentStances.stance,
		})
		.from(starSystemDevelopmentStances)
		.where(
			and(
				eq(starSystemDevelopmentStances.gameId, gameId),
				eq(starSystemDevelopmentStances.turnNumber, ctx.turn),
			),
		);

	const stanceBySystemId = new Map(
		stances.map((row) => [row.starSystemId, row.stance]),
	);

	for (const system of systems) {
		const stance = stanceBySystemId.get(system.id) ?? defaultDevelopmentStance;
		const effect = getDevelopmentStanceEffect(stance);

		if (effect.industryDelta !== 0) {
			await tx
				.update(starSystems)
				.set({ industry: system.industry + effect.industryDelta })
				.where(eq(starSystems.id, system.id));

			ctx.addIndustryChange({
				starSystemId: system.id,
				industryTotal: system.industry + effect.industryDelta,
				industryUtilized: 0,
			});
		}

		if (effect.populationBonusRate <= 0) {
			continue;
		}

		const populations = await tx
			.select({
				allegianceToPlayerId: starSystemPopulations.allegianceToPlayerId,
				amount: starSystemPopulations.amount,
				growthLeftover: starSystemPopulations.growthLeftover,
			})
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, system.id));

		if (populations.length === 0) {
			continue;
		}

		const totalAmount = populations.reduce((acc, pop) => acc + pop.amount, 0n);
		if (totalAmount <= 0n) {
			continue;
		}

		const totalAmountNumber = Number(totalAmount);

		for (const pop of populations) {
			const amountNumber = Number(pop.amount);
			const factor = amountNumber / totalAmountNumber;
			const growth =
				totalAmountNumber * effect.populationBonusRate * factor +
				Number(pop.growthLeftover);
			const growthInt = BigInt(Math.floor(growth));
			const newAmount = pop.amount + growthInt;

			await tx
				.update(starSystemPopulations)
				.set({
					amount: newAmount,
					growthLeftover: `${growth - Number(growthInt)}`,
				})
				.where(
					and(
						eq(starSystemPopulations.starSystemId, system.id),
						eq(
							starSystemPopulations.allegianceToPlayerId,
							pop.allegianceToPlayerId,
						),
					),
				);

			if (growthInt > 0n) {
				ctx.addPopulationChange({
					starSystemId: system.id,
					populationId: `${system.id}:${pop.allegianceToPlayerId}`,
					previousAmount: pop.amount,
					newAmount,
					growth: growthInt,
				});

				ctx.postMessage({
					type: "starSystem:populationChanged",
					id: system.id,
					populationId: `${system.id}:${pop.allegianceToPlayerId}`,
					amount: newAmount,
					growthPerTick: growthInt,
				});
			}
		}
	}
}
