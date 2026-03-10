import {
	and,
	dilemmas,
	eq,
	games,
	isNull,
	or,
	players,
	taskForceEngagements,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const endTurn: NonNullable<MutationResolvers["endTurn"]> = async (
	_parent,
	{ expectedTurnNumber, gameId },
	ctx,
) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, gameId),
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "GAME_NOT_FOUND" },
		});
	}

	if (!game.startedAt) {
		throw createGraphQLError("Game has not started yet", {
			extensions: { code: "GAME_NOT_STARTED" },
		});
	}

	if (game.turnNumber !== expectedTurnNumber) {
		throw createGraphQLError("Turn window changed before submission", {
			extensions: {
				code: "TURN_WINDOW_MISMATCH",
				expectedTurnNumber,
				actualTurnNumber: game.turnNumber,
			},
		});
	}

	const [player] = await ctx.drizzle
		.select()
		.from(players)
		.where(and(eq(players.userId, context.userId), eq(players.gameId, gameId)));

	if (!player) {
		throw createGraphQLError("Not authorized to end turn in this game", {
			extensions: { code: "NOT_AUTHORIZED" },
		});
	}

	if (player.turnEndedAt) {
		throw createGraphQLError("Turn already ended for this turn window", {
			extensions: { code: "TURN_ALREADY_ENDED" },
		});
	}

	const hasUnresolvedDilemmas = await ctx.drizzle
		.select()
		.from(dilemmas)
		.where(
			and(
				eq(dilemmas.gameId, gameId),
				eq(dilemmas.ownerId, context.userId),
				isNull(dilemmas.choosen),
			),
		);

	if (hasUnresolvedDilemmas.length > 0) {
		const blockers = hasUnresolvedDilemmas.map((dilemma) => ({
			type: "dilemma",
			id: dilemma.id,
		}));

		throw createGraphQLError(
			"You cannot end your turn while there are unresolved dilemmas",
			{
				extensions: { code: "UNRESOLVED_DILEMMAS", blockers },
			},
		);
	}

	const hasUnresolvedEngagements = await ctx.drizzle
		.select({
			id: taskForceEngagements.id,
		})
		.from(taskForceEngagements)
		.where(
			and(
				eq(taskForceEngagements.gameId, gameId),
				isNull(taskForceEngagements.resolvedAtTurn),
				or(
					eq(taskForceEngagements.ownerIdA, context.userId),
					eq(taskForceEngagements.ownerIdB, context.userId),
				),
			),
		);

	if (hasUnresolvedEngagements.length > 0) {
		const blockers = hasUnresolvedEngagements.map((engagement) => ({
			type: "engagement",
			id: engagement.id,
		}));

		throw createGraphQLError(
			"You cannot end your turn while there are unresolved engagements",
			{
				extensions: { code: "UNRESOLVED_ENGAGEMENTS", blockers },
			},
		);
	}

	const updatedPlayers = await ctx.drizzle
		.update(players)
		.set({
			turnEndedAt: new Date(),
		})
		.where(
			and(
				eq(players.userId, context.userId),
				eq(players.gameId, gameId),
				isNull(players.turnEndedAt),
			),
		)
		.returning({ gameId: players.gameId });

	if (updatedPlayers.length === 0) {
		throw createGraphQLError("Turn already ended for this turn window", {
			extensions: { code: "TURN_ALREADY_ENDED" },
		});
	}

	return game;
};
