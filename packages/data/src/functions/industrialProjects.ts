import {
	type IndustrialProjectType,
	industrialProjectTypes,
} from "../schema/starSystems.ts";

export type IndustrialProjectCategory =
	| "industry"
	| "discovery"
	| "population"
	| "logistics";

export type IndustrialProjectDefinition = {
	type: IndustrialProjectType;
	displayName: string;
	category: IndustrialProjectCategory;
	description: string;
	industryPerTurn: number;
	workRequired: number;
	completionIndustryBonus: number;
	maintenanceCost: number;
	// Completion effects (only relevant field used per project):
	discoveryProgressBoost?: number;
	discoverySlotBonus?: number;
	populationSeed?: bigint;
	populationGrowthBonus?: number;
	constructionCostModifier?: number;
};

export const industrialProjectCatalog: Record<
	IndustrialProjectType,
	IndustrialProjectDefinition
> = {
	factory_expansion: {
		type: "factory_expansion",
		displayName: "Factory Expansion",
		category: "industry",
		description: "Expand surface-level manufacturing lines to boost output.",
		industryPerTurn: 3,
		workRequired: 12,
		completionIndustryBonus: 2,
		maintenanceCost: 1,
	},
	automation_hub: {
		type: "automation_hub",
		displayName: "Automation Hub",
		category: "industry",
		description:
			"Deploy automated production drones across the system for continuous yield.",
		industryPerTurn: 4,
		workRequired: 18,
		completionIndustryBonus: 3,
		maintenanceCost: 2,
	},
	orbital_foundry: {
		type: "orbital_foundry",
		displayName: "Orbital Foundry",
		category: "industry",
		description:
			"Construct a zero-gravity mega-forge in orbit for massive industrial gains.",
		industryPerTurn: 6,
		workRequired: 30,
		completionIndustryBonus: 5,
		maintenanceCost: 3,
	},
	deep_core_scanner: {
		type: "deep_core_scanner",
		displayName: "Deep Core Scanner",
		category: "discovery",
		description:
			"Bore deep-spectrum probes into the planetary core to accelerate resource surveys.",
		industryPerTurn: 3,
		workRequired: 15,
		completionIndustryBonus: 0,
		maintenanceCost: 1,
		discoveryProgressBoost: 0.25,
	},
	xenoarchaeology_lab: {
		type: "xenoarchaeology_lab",
		displayName: "Xenoarchaeology Lab",
		category: "discovery",
		description:
			"Establish a dedicated research institute to unlock additional discovery potential.",
		industryPerTurn: 4,
		workRequired: 25,
		completionIndustryBonus: 0,
		maintenanceCost: 2,
		discoverySlotBonus: 1,
	},
	habitation_dome: {
		type: "habitation_dome",
		displayName: "Habitation Dome",
		category: "population",
		description:
			"Construct pressurized living quarters to seed an immediate wave of colonists.",
		industryPerTurn: 3,
		workRequired: 14,
		completionIndustryBonus: 0,
		maintenanceCost: 1,
		populationSeed: 500_000n,
	},
	gravity_well_spire: {
		type: "gravity_well_spire",
		displayName: "Gravity Well Spire",
		category: "population",
		description:
			"Erect a gravity-stabilized arcology that permanently accelerates population growth.",
		industryPerTurn: 5,
		workRequired: 28,
		completionIndustryBonus: 0,
		maintenanceCost: 2,
		populationGrowthBonus: 0.2,
	},
	fleet_drydock: {
		type: "fleet_drydock",
		displayName: "Fleet Drydock",
		category: "logistics",
		description:
			"Build a dedicated orbital shipyard to reduce task force construction costs.",
		industryPerTurn: 4,
		workRequired: 22,
		completionIndustryBonus: 0,
		maintenanceCost: 2,
		constructionCostModifier: 0.2,
	},
};

export function isIndustrialProjectType(
	value: string,
): value is IndustrialProjectType {
	return industrialProjectTypes.includes(value as IndustrialProjectType);
}
