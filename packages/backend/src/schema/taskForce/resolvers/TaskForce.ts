import {
	and,
	eq,
	games,
	inArray,
	players,
	shipComponents,
	shipDesignComponents,
	shipDesigns,
	taskForceShipDesigns,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceResolvers } from "./../../types.generated.js";
import { deriveCombatProfile, eligibleCardIds } from "./combatProfileLogic.ts";
export const TaskForce: TaskForceResolvers = {
	name: (parent) => {
		return parent.name ?? "Unknown";
	},
	sensorRange: (parent) => {
		return parent.sensorRange !== null && parent.sensorRange !== undefined
			? Number(parent.sensorRange)
			: 0;
	},
	combatDeck: (parent) => parent.combatDeck ?? [],
	constructionDone: (parent) =>
		parent.constructionDone !== null && parent.constructionDone !== undefined
			? Number(parent.constructionDone)
			: null,
	constructionTotal: (parent) =>
		parent.constructionTotal !== null && parent.constructionTotal !== undefined
			? Number(parent.constructionTotal)
			: null,
	constructionPerTick: (parent) =>
		parent.constructionPerTick !== null &&
		parent.constructionPerTick !== undefined
			? Number(parent.constructionPerTick)
			: null,
	shipDesigns: async (parent, _arg, ctx) => {
		const links = await ctx.drizzle
			.select({ shipDesignId: taskForceShipDesigns.shipDesignId })
			.from(taskForceShipDesigns)
			.where(eq(taskForceShipDesigns.taskForceId, parent.id));

		if (links.length === 0) return [];

		return ctx.drizzle.query.shipDesigns.findMany({
			where: inArray(
				shipDesigns.id,
				links.map((l) => l.shipDesignId),
			),
		});
	},
	combatProfile: async (parent, _arg, ctx) => {
		const components = await ctx.drizzle
			.select({
				weaponDamage: shipComponents.weaponDamage,
				shieldStrength: shipComponents.shieldStrength,
				thruster: shipComponents.thruster,
				sensorPrecision: shipComponents.sensorPrecision,
				crewCapacity: shipComponents.crewCapacity,
				crewNeed: shipComponents.crewNeed,
			})
			.from(taskForceShipDesigns)
			.innerJoin(
				shipDesignComponents,
				eq(
					shipDesignComponents.shipDesignId,
					taskForceShipDesigns.shipDesignId,
				),
			)
			.innerJoin(
				shipComponents,
				eq(shipComponents.id, shipDesignComponents.shipComponentId),
			)
			.where(eq(taskForceShipDesigns.taskForceId, parent.id));

		const profile = deriveCombatProfile(components);
		return { ...profile, eligibleCardIds: eligibleCardIds(profile) };
	},
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
			throw createGraphQLError("Owner not found");
		}

		return owner;
	},
	game: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
		});

		if (!game) {
			throw createGraphQLError("Game not found");
		}

		return game;
	},
};
