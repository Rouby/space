import { and, eq, games, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TaskForceEngagementResolvers } from "../../types.generated.js";
import { type RoundLogEntry, requireCombatState } from "./combatRuntime.ts";

export const TaskForceEngagement: TaskForceEngagementResolvers = {
	game: async (parent, _arg, ctx) => {
		const game = await ctx.drizzle.query.games.findFirst({
			where: eq(games.id, parent.gameId),
		});

		if (!game) {
			throw createGraphQLError("Game not found", {
				extensions: { code: "NOT_FOUND" },
			});
		}

		return game;
	},
	taskForceA: async (parent, _arg, ctx) => {
		const taskForce = await ctx.drizzle.query.taskForces.findFirst({
			where: and(
				eq(taskForces.id, parent.taskForceIdA),
				eq(taskForces.gameId, parent.gameId),
			),
		});
		if (!taskForce) {
			throw createGraphQLError("Task force not found", {
				extensions: { code: "NOT_FOUND" },
			});
		}
		return { ...taskForce, isVisible: true, lastUpdate: null };
	},
	taskForceB: async (parent, _arg, ctx) => {
		const taskForce = await ctx.drizzle.query.taskForces.findFirst({
			where: and(
				eq(taskForces.id, parent.taskForceIdB),
				eq(taskForces.gameId, parent.gameId),
			),
		});
		if (!taskForce) {
			throw createGraphQLError("Task force not found", {
				extensions: { code: "NOT_FOUND" },
			});
		}
		return { ...taskForce, isVisible: true, lastUpdate: null };
	},
	participantA: (parent, _arg, ctx) => {
		const state = requireCombatState(parent.stateA);
		return {
			...state,
			deckRemaining: state.deck.length,
			submittedCardId:
				parent.phase === "awaiting_submissions" &&
				parent.ownerIdA !== ctx.userId
					? null
					: parent.submittedCardIdA,
		};
	},
	participantB: (parent, _arg, ctx) => {
		const state = requireCombatState(parent.stateB);
		return {
			...state,
			deckRemaining: state.deck.length,
			submittedCardId:
				parent.phase === "awaiting_submissions" &&
				parent.ownerIdB !== ctx.userId
					? null
					: parent.submittedCardIdB,
		};
	},
	roundLog: (parent) =>
		((parent.roundLog as RoundLogEntry[] | null) ?? []).map((entry) => ({
			...entry,
		})),
};
