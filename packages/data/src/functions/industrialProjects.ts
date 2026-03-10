import {
	type IndustrialProjectType,
	industrialProjectTypes,
} from "../schema/starSystems.ts";

export type IndustrialProjectDefinition = {
	type: IndustrialProjectType;
	displayName: string;
	industryPerTurn: number;
	workRequired: number;
	completionIndustryBonus: number;
};

export const industrialProjectCatalog: Record<
	IndustrialProjectType,
	IndustrialProjectDefinition
> = {
	factory_expansion: {
		type: "factory_expansion",
		displayName: "Factory Expansion",
		industryPerTurn: 3,
		workRequired: 12,
		completionIndustryBonus: 2,
	},
	automation_hub: {
		type: "automation_hub",
		displayName: "Automation Hub",
		industryPerTurn: 4,
		workRequired: 18,
		completionIndustryBonus: 3,
	},
	orbital_foundry: {
		type: "orbital_foundry",
		displayName: "Orbital Foundry",
		industryPerTurn: 6,
		workRequired: 30,
		completionIndustryBonus: 5,
	},
};

export function isIndustrialProjectType(
	value: string,
): value is IndustrialProjectType {
	return industrialProjectTypes.includes(value as IndustrialProjectType);
}
