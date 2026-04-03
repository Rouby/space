import {
	getPopulationCappedIndustry,
	getTotalCompletedProjectMaintenance,
	industrialProjectCatalog,
} from "@space/data/functions";
import {
	and,
	eq,
	sql,
	starSystemIndustrialProjects,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export type IndustrialProjectCompletionChange = {
	starSystemId: string;
	projectType: string;
	industryBonus: number;
};

export async function tickIndustrialProjects(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const projects = await tx
		.select({
			id: starSystemIndustrialProjects.id,
			gameId: starSystemIndustrialProjects.gameId,
			starSystemId: starSystemIndustrialProjects.starSystemId,
			projectType: starSystemIndustrialProjects.projectType,
			industryPerTurn: starSystemIndustrialProjects.industryPerTurn,
			workRequired: starSystemIndustrialProjects.workRequired,
			workDone: starSystemIndustrialProjects.workDone,
			completionIndustryBonus:
				starSystemIndustrialProjects.completionIndustryBonus,
			maintenanceCost: starSystemIndustrialProjects.maintenanceCost,
			queuePosition: starSystemIndustrialProjects.queuePosition,
			startedAtTurn: starSystemIndustrialProjects.startedAtTurn,
			completedAtTurn: starSystemIndustrialProjects.completedAtTurn,
			playerId: starSystemIndustrialProjects.playerId,
		})
		.from(starSystemIndustrialProjects)
		.where(eq(starSystemIndustrialProjects.gameId, gameId));

	const systemsWithIndustry = await tx
		.select({
			id: starSystems.id,
			industry: starSystems.industry,
			ownerId: starSystems.ownerId,
		})
		.from(starSystems)
		.where(eq(starSystems.gameId, gameId));

	const populations = await tx
		.select({
			starSystemId: starSystemPopulations.starSystemId,
			amount: starSystemPopulations.amount,
		})
		.from(starSystemPopulations);

	const totalPopulationBySystem = populations.reduce((acc, population) => {
		acc.set(
			population.starSystemId,
			(acc.get(population.starSystemId) ?? 0) + Number(population.amount),
		);
		return acc;
	}, new Map<string, number>());

	for (const system of systemsWithIndustry) {
		const totalPopulation = totalPopulationBySystem.get(system.id) ?? 0;
		const effectiveIndustryTotal = getPopulationCappedIndustry(
			system.industry,
			totalPopulation,
		);
		const totalMaintenanceCost = getTotalCompletedProjectMaintenance(
			projects.filter((project) => project.starSystemId === system.id),
		);
		const alreadyUtilized = ctx.getIndustryUtilized?.(system.id) ?? 0;
		const remainingIndustryAfterEarlierUsage = Math.max(
			effectiveIndustryTotal - alreadyUtilized,
			0,
		);
		const appliedMaintenance = Math.min(
			totalMaintenanceCost,
			remainingIndustryAfterEarlierUsage,
		);

		const queue = projects
			.filter(
				(project) =>
					project.starSystemId === system.id &&
					project.completedAtTurn === null &&
					project.workDone < project.workRequired,
			)
			.sort((a, b) => a.queuePosition - b.queuePosition);

		if (queue.length === 0) {
			if (appliedMaintenance > 0) {
				ctx.addIndustryChange({
					starSystemId: system.id,
					industryTotal: effectiveIndustryTotal,
					industryUtilized: appliedMaintenance,
				});
			}
			continue;
		}

		let availableIndustry = Math.max(
			remainingIndustryAfterEarlierUsage - appliedMaintenance,
			0,
		);
		let utilizedIndustry = appliedMaintenance;
		let industryTotal = system.industry;
		let effectiveIndustryForReport = effectiveIndustryTotal;

		for (const project of queue) {
			if (availableIndustry <= 0) {
				break;
			}

			const workRemaining = Math.max(
				project.workRequired - project.workDone,
				0,
			);
			const workApplied = Math.min(
				availableIndustry,
				project.industryPerTurn,
				workRemaining,
			);

			if (workApplied <= 0) {
				continue;
			}

			const nextWorkDone = project.workDone + workApplied;
			const completed = nextWorkDone >= project.workRequired;
			availableIndustry -= workApplied;
			utilizedIndustry += workApplied;

			await tx
				.update(starSystemIndustrialProjects)
				.set({
					workDone: nextWorkDone,
					startedAtTurn: project.startedAtTurn ?? ctx.turn,
					completedAtTurn: completed ? ctx.turn : null,
				})
				.where(
					and(
						eq(starSystemIndustrialProjects.id, project.id),
						eq(starSystemIndustrialProjects.gameId, project.gameId),
					),
				);

			ctx.postMessage({
				type: "starSystem:industrialProjectProgress",
				id: project.id,
				starSystemId: project.starSystemId,
				workDone: nextWorkDone,
				workRequired: project.workRequired,
			});

			if (completed) {
				// Apply completion effect based on project type
				await applyCompletionEffect(tx, project, system);

				if (project.completionIndustryBonus > 0) {
					industryTotal += project.completionIndustryBonus;
					effectiveIndustryForReport = getPopulationCappedIndustry(
						industryTotal,
						totalPopulation,
					);

					await tx
						.update(starSystems)
						.set({
							industry: industryTotal,
						})
						.where(eq(starSystems.id, project.starSystemId));
				}

				ctx.addIndustrialProjectCompletion?.({
					starSystemId: project.starSystemId,
					projectType: project.projectType,
					industryBonus: project.completionIndustryBonus,
				});

				ctx.postMessage({
					type: "starSystem:industrialProjectCompleted",
					id: project.id,
					starSystemId: project.starSystemId,
					projectType: project.projectType,
					industryBonus: project.completionIndustryBonus,
					newIndustryTotal: industryTotal,
				});
			}
		}

		if (utilizedIndustry > 0) {
			ctx.addIndustryChange({
				starSystemId: system.id,
				industryTotal: effectiveIndustryForReport,
				industryUtilized: utilizedIndustry,
			});
		}
	}
}

async function applyCompletionEffect(
	tx: Transaction,
	project: {
		projectType: string;
		starSystemId: string;
		playerId: string;
	},
	system: { id: string; ownerId: string | null },
) {
	const definition =
		industrialProjectCatalog[
			project.projectType as keyof typeof industrialProjectCatalog
		];
	if (!definition) return;

	if (definition.discoveryProgressBoost) {
		await tx
			.update(starSystems)
			.set({
				discoveryProgress: sql`${starSystems.discoveryProgress} + ${definition.discoveryProgressBoost}::numeric`,
			})
			.where(eq(starSystems.id, project.starSystemId));
	}

	if (definition.discoverySlotBonus) {
		await tx
			.update(starSystems)
			.set({
				discoverySlots: sql`${starSystems.discoverySlots} + ${definition.discoverySlotBonus}`,
			})
			.where(eq(starSystems.id, project.starSystemId));
	}

	if (definition.populationSeed && system.ownerId) {
		// Seed population for the system owner
		const playerId = system.ownerId;
		const existing = await tx
			.select({ amount: starSystemPopulations.amount })
			.from(starSystemPopulations)
			.where(
				and(
					eq(starSystemPopulations.starSystemId, project.starSystemId),
					eq(starSystemPopulations.allegianceToPlayerId, playerId),
				),
			);

		if (existing.length > 0) {
			await tx
				.update(starSystemPopulations)
				.set({
					amount: sql`${starSystemPopulations.amount} + ${definition.populationSeed.toString()}`,
				})
				.where(
					and(
						eq(starSystemPopulations.starSystemId, project.starSystemId),
						eq(starSystemPopulations.allegianceToPlayerId, playerId),
					),
				);
		} else {
			await tx.insert(starSystemPopulations).values({
				starSystemId: project.starSystemId,
				allegianceToPlayerId: playerId,
				amount: definition.populationSeed,
				growthLeftover: "0",
			});
		}
	}

	if (definition.populationGrowthBonus) {
		await tx
			.update(starSystems)
			.set({
				populationGrowthBonus: sql`${starSystems.populationGrowthBonus} + ${definition.populationGrowthBonus}::numeric`,
			})
			.where(eq(starSystems.id, project.starSystemId));
	}

	if (definition.constructionCostModifier) {
		await tx
			.update(starSystems)
			.set({
				constructionCostModifier: sql`${starSystems.constructionCostModifier} + ${definition.constructionCostModifier}::numeric`,
			})
			.where(eq(starSystems.id, project.starSystemId));
	}
}
