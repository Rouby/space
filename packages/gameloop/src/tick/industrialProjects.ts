import {
	and,
	eq,
	starSystemIndustrialProjects,
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
			queuePosition: starSystemIndustrialProjects.queuePosition,
			startedAtTurn: starSystemIndustrialProjects.startedAtTurn,
			completedAtTurn: starSystemIndustrialProjects.completedAtTurn,
		})
		.from(starSystemIndustrialProjects)
		.where(eq(starSystemIndustrialProjects.gameId, gameId));

	const systemsWithIndustry = await tx
		.select({
			id: starSystems.id,
			industry: starSystems.industry,
		})
		.from(starSystems)
		.where(eq(starSystems.gameId, gameId));

	for (const system of systemsWithIndustry) {
		const queue = projects
			.filter(
				(project) =>
					project.starSystemId === system.id &&
					project.completedAtTurn === null &&
					project.workDone < project.workRequired,
			)
			.sort((a, b) => a.queuePosition - b.queuePosition);

		if (queue.length === 0) {
			continue;
		}

		let availableIndustry = Math.max(
			system.industry - (ctx.getIndustryUtilized?.(system.id) ?? 0),
			0,
		);
		let utilizedIndustry = 0;
		let industryTotal = system.industry;

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
				industryTotal += project.completionIndustryBonus;

				await tx
					.update(starSystems)
					.set({
						industry: industryTotal,
					})
					.where(eq(starSystems.id, project.starSystemId));

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
				industryTotal,
				industryUtilized: utilizedIndustry,
			});
		}
	}
}
