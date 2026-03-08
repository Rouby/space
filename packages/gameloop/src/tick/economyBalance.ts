// Economy target: basic ship/fleet progress should be visible within roughly 1-2 rounds.
export const TARGET_BUILD_ROUNDS = 2;

// Internal balancing reference: these per-round values were tuned with an
// approximate mental model of ~2 in-world months per round.
// Calculations below remain intentionally round-native.

const POPULATION_SOFT_CAP = 20_000_000_000;
const BASE_POPULATION_GROWTH_PER_ROUND = 0.0012;
const MIN_POPULATION_GROWTH_PER_ROUND = 0.00005;

const BASE_MINING_UNITS_PER_ROUND = 180;

export function getPopulationGrowthRatePerRound(totalPopulation: number) {
	if (totalPopulation <= 0) {
		return 0;
	}

	const crowdingPenalty =
		1 - Math.log(totalPopulation / POPULATION_SOFT_CAP + 1);
	const roundRate = Math.max(
		0,
		BASE_POPULATION_GROWTH_PER_ROUND * crowdingPenalty,
	);

	return Math.max(MIN_POPULATION_GROWTH_PER_ROUND, roundRate);
}

export function getMiningRatePerRound(remainingDeposits: number) {
	if (remainingDeposits <= 0) {
		return 0;
	}

	return Math.min(BASE_MINING_UNITS_PER_ROUND, remainingDeposits);
}
