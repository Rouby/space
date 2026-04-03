import { and, eq, inArray, starSystems } from "@space/data/schema";
import type { TurnReportResolvers } from "./../../types.generated.ts";

export const TurnReport: TurnReportResolvers = {
	populationChanges: async (parent, _arg, _ctx) => {
		return parent.summary.populationChanges || [];
	},
	populationMigrations: async (parent, _arg, _ctx) => {
		return parent.summary.populationMigrations || [];
	},
	miningChanges: async (parent, _arg, _ctx) => {
		return parent.summary.miningChanges || [];
	},
	industryChanges: async (parent, _arg, _ctx) => {
		const changes = parent.summary.industryChanges || [];
		if (changes.length === 0) {
			return [];
		}

		const ownedSystems = await _ctx.drizzle.query.starSystems.findMany({
			columns: { id: true },
			where: and(
				eq(starSystems.gameId, parent.gameId),
				eq(starSystems.ownerId, parent.ownerId),
				inArray(
					starSystems.id,
					changes.map((change) => change.starSystemId),
				),
			),
		});

		const ownedSystemIds = new Set(ownedSystems.map((system) => system.id));
		return changes.filter((change) => ownedSystemIds.has(change.starSystemId));
	},
	industrialProjectCompletions: async (parent, _arg, _ctx) => {
		return parent.summary.industrialProjectCompletions || [];
	},
	taskForceConstructionChanges: async (parent, _arg, _ctx) => {
		return parent.summary.taskForceConstructionChanges || [];
	},
	createdAt: async (parent, _arg, _ctx) => {
		return parent.createdAt;
	},
	id: async (parent, _arg, _ctx) => {
		return parent.id;
	},
	turnNumber: async (parent, _arg, _ctx) => {
		return parent.turnNumber;
	},
	taskForceEngagements: async (parent, _arg, _ctx) => {
		return parent.summary.taskForceEngagements || [];
	},
	colonizationPressureChanges: async (parent, _arg, _ctx) => {
		return parent.summary.colonizationPressureChanges || [];
	},
	colonizationCompleted: async (parent, _arg, _ctx) => {
		return parent.summary.colonizationCompleted || [];
	},
	researchProgressChanges: async (parent, _arg, _ctx) => {
		return parent.summary.researchProgressChanges || [];
	},
	researchBreakthroughs: async (parent, _arg, _ctx) => {
		return parent.summary.researchBreakthroughs || [];
	},
};
