const BASE_INDUSTRY_CAP = 5;
const POPULATION_PER_INDUSTRY = 500_000_000;

const DUPLICATE_MAINTENANCE_RAMP_NUMERATOR = 3;
const DUPLICATE_MAINTENANCE_RAMP_DENOMINATOR = 4;

import { industrialProjectCatalog } from "./industrialProjects.ts";

export type IndustryBreakdown = {
	rawIndustry: number;
	populationCap: number;
	cappedIndustry: number;
	maintenance: number;
	colonizationAllocated: number;
	netIndustry: number;
};

type CompletedProjectMaintenanceInput = {
	id?: string | number;
	projectType: string;
	maintenanceCost: number;
	completedAtTurn: number | null;
	queuePosition?: number;
};

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

export function getIndustryBreakdown(
	rawIndustry: number,
	totalPopulation: bigint | number,
	maintenance = 0,
	colonizationAllocated = 0,
): IndustryBreakdown {
	const populationCap = getIndustryCapacityForPopulation(totalPopulation);
	const cappedIndustry = Math.min(Math.max(rawIndustry, 0), populationCap);
	const appliedMaintenance = Math.max(maintenance, 0);
	const appliedColonizationAllocated = Math.max(colonizationAllocated, 0);

	return {
		rawIndustry: Math.max(rawIndustry, 0),
		populationCap,
		cappedIndustry,
		maintenance: appliedMaintenance,
		colonizationAllocated: appliedColonizationAllocated,
		netIndustry: Math.max(
			cappedIndustry - appliedMaintenance - appliedColonizationAllocated,
			0,
		),
	};
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

function getCompletedProjectMaintenanceOrder(
	a: CompletedProjectMaintenanceInput,
	b: CompletedProjectMaintenanceInput,
) {
	const completedAtTurnA = a.completedAtTurn ?? Number.MAX_SAFE_INTEGER;
	const completedAtTurnB = b.completedAtTurn ?? Number.MAX_SAFE_INTEGER;

	if (completedAtTurnA !== completedAtTurnB) {
		return completedAtTurnA - completedAtTurnB;
	}

	const queuePositionA = a.queuePosition ?? Number.MAX_SAFE_INTEGER;
	const queuePositionB = b.queuePosition ?? Number.MAX_SAFE_INTEGER;

	if (queuePositionA !== queuePositionB) {
		return queuePositionA - queuePositionB;
	}

	return String(a.id ?? "").localeCompare(String(b.id ?? ""));
}

export function getEffectiveCompletedProjectMaintenance<
	T extends CompletedProjectMaintenanceInput,
>(projects: T[]) {
	const completedProjectCopies = new Map<string, number>();

	return [...projects]
		.filter((project) => project.completedAtTurn !== null)
		.sort(getCompletedProjectMaintenanceOrder)
		.map((project) => {
			const copyIndex =
				(completedProjectCopies.get(project.projectType) ?? 0) + 1;
			completedProjectCopies.set(project.projectType, copyIndex);

			const definition =
				industrialProjectCatalog[
					project.projectType as keyof typeof industrialProjectCatalog
				];
			const baseMaintenance = Math.max(
				project.maintenanceCost,
				definition?.maintenanceCost ?? project.maintenanceCost,
			);

			return {
				...project,
				effectiveMaintenanceCost: getDuplicateProjectMaintenanceCost(
					baseMaintenance,
					copyIndex,
				),
			};
		});
}

export function getTotalCompletedProjectMaintenance(
	projects: CompletedProjectMaintenanceInput[],
) {
	return getEffectiveCompletedProjectMaintenance(projects).reduce(
		(acc, project) => acc + project.effectiveMaintenanceCost,
		0,
	);
}
