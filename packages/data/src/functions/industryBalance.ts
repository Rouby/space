const BASE_INDUSTRY_CAP = 1;
const POPULATION_PER_INDUSTRY = 800_000_000;

const DUPLICATE_MAINTENANCE_RAMP_NUMERATOR = 3;
const DUPLICATE_MAINTENANCE_RAMP_DENOMINATOR = 4;

export function getIndustryCapacityForPopulation(
	totalPopulation: bigint | number,
) {
	const population =
		typeof totalPopulation === "bigint"
			? Number(totalPopulation)
			: totalPopulation;

	if (population <= 0) {
		return 0;
	}

	return BASE_INDUSTRY_CAP + Math.floor(population / POPULATION_PER_INDUSTRY);
}

export function getPopulationCappedIndustry(
	rawIndustry: number,
	totalPopulation: bigint | number,
) {
	if (rawIndustry <= 0) {
		return 0;
	}

	return Math.min(
		rawIndustry,
		getIndustryCapacityForPopulation(totalPopulation),
	);
}

export function getDuplicateProjectMaintenanceCost(
	baseMaintenance: number,
	copyIndex: number,
) {
	if (baseMaintenance <= 0 || copyIndex <= 0) {
		return 0;
	}

	const duplicateRamp = Math.floor(
		((copyIndex - 1) * DUPLICATE_MAINTENANCE_RAMP_NUMERATOR) /
			DUPLICATE_MAINTENANCE_RAMP_DENOMINATOR,
	);

	return baseMaintenance + duplicateRamp;
}
