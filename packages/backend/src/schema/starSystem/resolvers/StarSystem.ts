import {
	computeDevelopmentStanceProjection,
	defaultDevelopmentStance,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	players,
	starSystemColonizations,
	starSystemDevelopmentStances,
	starSystemPopulations,
	starSystemResourceDiscoveries,
} from "@space/data/schema";
import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: Pick<
	StarSystemResolvers,
	| "colonization"
	| "currentDevelopmentStance"
	| "discoveries"
	| "discoveryProgress"
	| "id"
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
		return (
			(await ctx.drizzle.query.starSystemColonizations.findFirst({
				where: eq(starSystemColonizations.starSystemId, parent.id),
			})) ?? null
		);
	},
	industry: async (parent, _arg, _ctx) => {
		return parent.industry;
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
