import {
	type ResearchCategory,
	type ResearchMethodology,
	researchCategories,
	researchMethodologies,
} from "../schema/research.ts";

export type {
	ResearchCategory,
	ResearchMethodology,
} from "../schema/research.ts";
export {
	researchCategories,
	researchMethodologies,
} from "../schema/research.ts";

export const defaultResearchPrimaryCategory: ResearchCategory = "industry";
export const defaultResearchSecondaryCategory: ResearchCategory = "discovery";
export const defaultResearchMethodology: ResearchMethodology = "opportunistic";

export type ResearchWeights = Record<ResearchCategory, number>;

const methodologyMultipliers: Record<ResearchMethodology, number> = {
	stable: 0.95,
	bold: 1.1,
	opportunistic: 1,
};

export const researchOutcomesCatalog: Record<
	ResearchCategory,
	Array<{
		key: string;
		displayName: string;
		baseWeight: number;
		modes: Array<{ mode: string; stat: string; modifier: number }>;
	}>
> = {
	military: [
		{
			key: "adaptive_armor_doctrine",
			displayName: "Adaptive Armor Doctrine",
			baseWeight: 1,
			modes: [
				{ mode: "defensive", stat: "armorThickness", modifier: 0.08 },
				{
					mode: "manufacturing",
					stat: "constructionCostModifier",
					modifier: -0.05,
				},
			],
		},
		{
			key: "fire_control_refit",
			displayName: "Fire Control Refit",
			baseWeight: 0.9,
			modes: [
				{ mode: "accuracy", stat: "weaponAccuracy", modifier: 0.06 },
				{ mode: "cooldown", stat: "weaponCooldown", modifier: -0.05 },
			],
		},
	],
	industry: [
		{
			key: "process_orchestration",
			displayName: "Process Orchestration",
			baseWeight: 1,
			modes: [
				{ mode: "throughput", stat: "industry", modifier: 0.06 },
				{ mode: "efficiency", stat: "maintenanceCost", modifier: -0.05 },
			],
		},
		{
			key: "deep_assembly_protocols",
			displayName: "Deep Assembly Protocols",
			baseWeight: 0.8,
			modes: [
				{
					mode: "shipyards",
					stat: "constructionCostModifier",
					modifier: -0.06,
				},
				{ mode: "projects", stat: "industrialProjectWork", modifier: 0.08 },
			],
		},
	],
	expansion: [
		{
			key: "frontier_logistics",
			displayName: "Frontier Logistics",
			baseWeight: 1,
			modes: [
				{ mode: "reach", stat: "zoneOfControl", modifier: 0.07 },
				{ mode: "colonization", stat: "colonizationPressure", modifier: 0.08 },
			],
		},
		{
			key: "migration_harmonics",
			displayName: "Migration Harmonics",
			baseWeight: 0.75,
			modes: [
				{ mode: "growth", stat: "populationGrowthBonus", modifier: 0.06 },
				{ mode: "transfer", stat: "migrationFlow", modifier: 0.08 },
			],
		},
	],
	discovery: [
		{
			key: "signal_cartography",
			displayName: "Signal Cartography",
			baseWeight: 1,
			modes: [
				{ mode: "scan_speed", stat: "discoveryProgress", modifier: 0.08 },
				{ mode: "yield", stat: "resourceYield", modifier: 0.06 },
			],
		},
		{
			key: "xeno_mineralogy",
			displayName: "Xeno Mineralogy",
			baseWeight: 0.7,
			modes: [
				{ mode: "deposits", stat: "remainingDeposits", modifier: 0.06 },
				{ mode: "mining", stat: "miningRate", modifier: 0.06 },
			],
		},
	],
};

const adjacentCategory: Record<ResearchCategory, ResearchCategory[]> = {
	military: ["industry", "expansion"],
	industry: ["military", "discovery"],
	expansion: ["military", "discovery"],
	discovery: ["industry", "expansion"],
};

export function parseResearchCategory(value: string): ResearchCategory | null {
	if (researchCategories.includes(value as ResearchCategory)) {
		return value as ResearchCategory;
	}

	return null;
}

export function parseResearchMethodology(
	value: string,
): ResearchMethodology | null {
	if (researchMethodologies.includes(value as ResearchMethodology)) {
		return value as ResearchMethodology;
	}

	return null;
}

export function getMethodologyMultiplier(
	methodology: ResearchMethodology,
): number {
	return methodologyMultipliers[methodology];
}

export function buildResearchWeights(
	primary: ResearchCategory,
	secondary: ResearchCategory,
): ResearchWeights {
	const otherCategories = researchCategories.filter(
		(category) => category !== primary && category !== secondary,
	);
	const otherWeight = 0.15 / otherCategories.length;

	return {
		military:
			primary === "military"
				? 0.55
				: secondary === "military"
					? 0.3
					: otherWeight,
		industry:
			primary === "industry"
				? 0.55
				: secondary === "industry"
					? 0.3
					: otherWeight,
		expansion:
			primary === "expansion"
				? 0.55
				: secondary === "expansion"
					? 0.3
					: otherWeight,
		discovery:
			primary === "discovery"
				? 0.55
				: secondary === "discovery"
					? 0.3
					: otherWeight,
	};
}

export function computeBaseKnowledge({
	populationBillions,
	starSystems,
	discoveries,
	combatRounds,
}: {
	populationBillions: number;
	starSystems: number;
	discoveries: number;
	combatRounds: number;
}): number {
	return Math.floor(
		Math.sqrt(Math.max(populationBillions, 0)) +
			0.5 * Math.max(starSystems, 0) +
			0.75 * Math.max(discoveries, 0) +
			0.25 * Math.max(combatRounds, 0),
	);
}

export function computeFatiguePenalty(consecutivePrimary: number): number {
	return Math.min(4, Math.max(0, consecutivePrimary - 2));
}

export function computeMomentumGain({
	baseKnowledge,
	weight,
	methodology,
	evidence,
	fatigue,
}: {
	baseKnowledge: number;
	weight: number;
	methodology: ResearchMethodology;
	evidence: number;
	fatigue: number;
}) {
	return (
		baseKnowledge * weight * getMethodologyMultiplier(methodology) +
		evidence -
		fatigue
	);
}

export function hypothesisThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return Math.round(10 * 1.2 ** (n - 1));
}

export function fieldworkThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return 6 + 2 * n;
}

export function synthesisThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return 12 + 3 * n;
}

export function effectiveBonus(rawBonus: number): number {
	if (rawBonus <= 0.25) {
		return rawBonus;
	}

	return 0.25 + (rawBonus - 0.25) * 0.5;
}

export function resolveOutcomeCandidates(
	category: ResearchCategory,
	secondaryCategory: ResearchCategory,
) {
	const primaryPool = researchOutcomesCatalog[category] ?? [];
	const adjacent = adjacentCategory[category];
	const secondaryContribution = adjacent.includes(secondaryCategory)
		? (researchOutcomesCatalog[secondaryCategory] ?? [])
		: [];

	return [...primaryPool, ...secondaryContribution];
}
