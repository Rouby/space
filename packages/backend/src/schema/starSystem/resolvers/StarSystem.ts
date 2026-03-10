import {
	computeDevelopmentStanceProjection,
	defaultDevelopmentStance,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	players,
	starSystemColonizationPressures,
	starSystemDevelopmentStances,
	starSystemIndustrialProjects,
	starSystemPopulations,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import { desc } from "drizzle-orm";
import type { StarSystemResolvers } from "./../../types.generated.js";

function withProjectEta<
	T extends { workRequired: number; workDone: number; industryPerTurn: number },
>(projects: T[]) {
	let cumulativeTurns = 0;

	return projects.map((project) => {
		const workLeft = Math.max(project.workRequired - project.workDone, 0);
		const turnsRemaining = Math.ceil(
			workLeft / Math.max(project.industryPerTurn, 1),
		);
		cumulativeTurns += turnsRemaining;

		return {
			...project,
			turnsRemaining,
			etaTurns: cumulativeTurns,
		};
	});
}
export const StarSystem: Pick<
	StarSystemResolvers,
	| "colonization"
	| "completedIndustrialProjects"
	| "currentDevelopmentStance"
	| "discoveries"
	| "discoveryProgress"
	| "id"
	| "industrialProjects"
	| "industry"
	| "isVisible"
	| "lastUpdate"
	| "name"
	| "nextTurnStanceProjection"
	| "owner"
	| "populations"
	| "position"
	| "sensorRange"
	| "__isTypeOf"
> = {
	owner: async (parent, _arg, ctx) => {
		if (!parent.ownerId) {
			return null;
		}

		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, parent.ownerId),
				eq(players.gameId, parent.gameId),
			),
			with: { user: true },
		});

		if (!owner) {
			return null;
		}

		return owner;
	},
	sensorRange: async (parent, _arg, _ctx) => {
		return parent.ownerId ? 1000 : null;
	},
	discoveries: async (parent, _arg, ctx) => {
		if (parent.discoverySlots === null) {
			return null;
		}

		const resourceDiscoveries = await ctx.drizzle
			.select()
			.from(starSystemResourceDiscoveries)
			.where(eq(starSystemResourceDiscoveries.starSystemId, parent.id));

		return [
			...resourceDiscoveries.map((d) => ({
				__typename: "ResourceDiscovery" as const,
				...d,
			})),
			...Array.from({ length: parent.discoverySlots }, (_, idx) => ({
				__typename: "UnknownDiscovery" as const,
				id: `${parent.id}-unknown-${idx}`,
				discoveredAt: new Date(),
			})),
		]
			.slice(0, parent.discoverySlots)
			.sort((d1, d2) => d1.discoveredAt.getTime() - d2.discoveredAt.getTime());
	},
	populations: async (parent, _arg, ctx) => {
		if (!parent.isVisible) {
			return null;
		}
		return ctx.drizzle
			.select()
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, parent.id));
	},
	discoveryProgress: async (_parent, _arg, _ctx) => {
		return _parent.discoveryProgress === null
			? null
			: +_parent.discoveryProgress;
	},
	colonization: async (parent, _arg, ctx) => {
		const pressures =
			await ctx.drizzle.query.starSystemColonizationPressures.findMany({
				where: eq(starSystemColonizationPressures.starSystemId, parent.id),
			});

		if (pressures.length === 0) return null;

		// For the UI, we might want to show the highest pressure or the one belonging to the viewing player.
		// Since we want to expose this to the player who's accumulating it, let's find if the current user has pressure.
		const myPressure = pressures.find((p) => p.ownerId === ctx.userId);

		if (!myPressure) return null; // Or return highest if we want public visibility

		const accumulated = Number(myPressure.accumulatedPressure);
		const pressurePerTurn = Number(myPressure.pressurePerTurn);

		const ownerSystems = await ctx.drizzle.query.starSystems.findMany({
			where: and(
				eq(starSystems.ownerId, myPressure.ownerId),
				eq(starSystems.gameId, myPressure.gameId),
			),
			columns: { position: true },
		});

		let minDistance = Number.MAX_VALUE;
		for (const sys of ownerSystems) {
			const dist = Math.sqrt(
				(sys.position.x - parent.position.x) ** 2 +
					(sys.position.y - parent.position.y) ** 2,
			);
			if (dist < minDistance) {
				minDistance = dist;
			}
		}

		const threshold =
			minDistance === Number.MAX_VALUE ? 10 : 10 + minDistance / 50;

		const turnsRemaining =
			pressurePerTurn > 0
				? Math.ceil(Math.max(0, threshold - accumulated) / pressurePerTurn)
				: 999;

		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, myPressure.ownerId),
				eq(players.gameId, myPressure.gameId),
			),
			with: { user: true },
		});

		if (!owner) return null;

		return {
			player: owner,
			accumulated,
			threshold,
			pressurePerTurn,
			etaTurns: turnsRemaining,
		};
	},
	industry: async (parent, _arg, _ctx) => {
		return parent.industry;
	},
	industrialProjects: async (parent, _arg, ctx) => {
		if (parent.industry === null) {
			return [];
		}

		const projects =
			await ctx.drizzle.query.starSystemIndustrialProjects.findMany({
				where: and(
					eq(starSystemIndustrialProjects.starSystemId, parent.id),
					eq(starSystemIndustrialProjects.gameId, parent.gameId),
				),
				orderBy: [starSystemIndustrialProjects.queuePosition],
			});

		const activeProjects = projects.filter(
			(project) => project.completedAtTurn === null,
		);
		return withProjectEta(activeProjects);
	},
	completedIndustrialProjects: async (parent, _arg, ctx) => {
		if (parent.industry === null) {
			return [];
		}

		const completedProjects =
			await ctx.drizzle.query.starSystemIndustrialProjects.findMany({
				where: and(
					eq(starSystemIndustrialProjects.starSystemId, parent.id),
					eq(starSystemIndustrialProjects.gameId, parent.gameId),
				),
				orderBy: [
					desc(starSystemIndustrialProjects.completedAtTurn),
					desc(starSystemIndustrialProjects.queuePosition),
				],
				limit: 5,
			});

		const finished = completedProjects.filter(
			(project) => project.completedAtTurn !== null,
		);

		return finished.map((project) => ({
			...project,
			turnsRemaining: 0,
			etaTurns: 0,
		}));
	},
	currentDevelopmentStance: async (parent, _arg, ctx) => {
		if (!ctx.userId || !parent.ownerId || parent.ownerId !== ctx.userId) {
			return null;
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		const currentStance =
			await ctx.drizzle.query.starSystemDevelopmentStances.findFirst({
				where: and(
					eq(starSystemDevelopmentStances.gameId, parent.gameId),
					eq(starSystemDevelopmentStances.starSystemId, parent.id),
					eq(starSystemDevelopmentStances.turnNumber, game.turnNumber),
				),
				columns: { stance: true },
			});

		return currentStance?.stance ?? defaultDevelopmentStance;
	},
	nextTurnStanceProjection: async (parent, _arg, ctx) => {
		if (!ctx.userId || !parent.ownerId || parent.ownerId !== ctx.userId) {
			return null;
		}

		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
			columns: { turnNumber: true },
		});

		if (!game) {
			return null;
		}

		const currentStance =
			await ctx.drizzle.query.starSystemDevelopmentStances.findFirst({
				where: and(
					eq(starSystemDevelopmentStances.gameId, parent.gameId),
					eq(starSystemDevelopmentStances.starSystemId, parent.id),
					eq(starSystemDevelopmentStances.turnNumber, game.turnNumber),
				),
				columns: { stance: true },
			});

		const populations = await ctx.drizzle
			.select({
				amount: starSystemPopulations.amount,
				growthLeftover: starSystemPopulations.growthLeftover,
			})
			.from(starSystemPopulations)
			.where(eq(starSystemPopulations.starSystemId, parent.id));

		return computeDevelopmentStanceProjection(
			currentStance?.stance ?? defaultDevelopmentStance,
			populations,
		);
	},
};
