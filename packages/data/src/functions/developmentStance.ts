import { getPopulationCappedIndustry } from "./industryBalance.ts";

export const developmentStances = [
	"industrialize",
	"balance",
	"grow_population",
] as const;

export type DevelopmentStance = (typeof developmentStances)[number];

export const defaultDevelopmentStance: DevelopmentStance = "balance";

export type DevelopmentStanceProjection = {
	industryDelta: number;
	populationDelta: bigint;
};

const stanceEffects: Record<
	DevelopmentStance,
	{ industryDelta: number; populationBonusRate: number }
> = {
	industrialize: {
		industryDelta: 2,
		populationBonusRate: 0,
	},
	balance: {
		industryDelta: 1,
		populationBonusRate: 0.0004,
	},
	grow_population: {
		industryDelta: 0,
		populationBonusRate: 0.0012,
	},
};

export function getDevelopmentStanceEffect(stance: DevelopmentStance) {
	return stanceEffects[stance];
}

export function parseDevelopmentStance(
	value: string,
): DevelopmentStance | null {
	if (developmentStances.includes(value as DevelopmentStance)) {
		return value as DevelopmentStance;
	}

	return null;
}

type PopulationInput = {
	amount: bigint | number | string;
	growthLeftover?: number | string | null;
};

export function computeDevelopmentStanceProjection(
	stance: DevelopmentStance,
	populations: PopulationInput[],
	currentIndustry?: number | null,
): DevelopmentStanceProjection {
	const { industryDelta, populationBonusRate } =
		getDevelopmentStanceEffect(stance);
	const normalized = populations.map((pop) => {
		const amount =
			typeof pop.amount === "bigint" ? pop.amount : BigInt(pop.amount);
		const growthLeftover = Number(pop.growthLeftover ?? 0);
		return { amount, growthLeftover };
	});
	const totalAmount = normalized.reduce((acc, pop) => acc + pop.amount, 0n);
	const projectedIndustryDelta =
		currentIndustry === null || currentIndustry === undefined
			? industryDelta
			: getPopulationCappedIndustry(
					currentIndustry + industryDelta,
					totalAmount,
				) - getPopulationCappedIndustry(currentIndustry, totalAmount);

	if (populationBonusRate <= 0 || normalized.length === 0) {
		return { industryDelta: projectedIndustryDelta, populationDelta: 0n };
	}

	if (totalAmount <= 0n) {
		return { industryDelta: projectedIndustryDelta, populationDelta: 0n };
	}

	const totalAmountNumber = Number(totalAmount);
	let totalPopulationDelta = 0n;

	for (const pop of normalized) {
		const amountNumber = Number(pop.amount);
		const factor = amountNumber / totalAmountNumber;
		const growth =
			totalAmountNumber * populationBonusRate * factor + pop.growthLeftover;
		const growthInt = BigInt(Math.floor(growth));
		totalPopulationDelta += growthInt;
	}

	return {
		industryDelta: projectedIndustryDelta,
		populationDelta: totalPopulationDelta,
	};
}
