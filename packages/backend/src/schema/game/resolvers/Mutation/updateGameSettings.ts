import { and, eq, games, players } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const updateGameSettings: NonNullable<
	MutationResolvers["updateGameSettings"]
> = async (_parent, { gameId, input }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	if (!ctx.userId) {
		throw createGraphQLError("Not authenticated", {
			extensions: { code: "NOT_AUTHORIZED" },
		});
	}

	const game = await ctx.drizzle.query.games.findFirst({
		where: eq(games.id, gameId),
	});

	if (!game) {
		throw createGraphQLError("Game not found", {
			extensions: { code: "GAME_NOT_FOUND" },
		});
	}

	if (game.startedAt) {
		throw createGraphQLError("Cannot update settings after game has started", {
			extensions: { code: "GAME_ALREADY_STARTED" },
		});
	}

	if (game.hostUserId !== ctx.userId) {
		context.denyAccess({
			message: "Not authorized to configure this game",
			code: "NOT_AUTHORIZED",
			reason: "update-settings-not-host",
			details: { gameId },
		});
	}

	const player = await ctx.drizzle.query.players.findFirst({
		where: and(eq(players.gameId, gameId), eq(players.userId, ctx.userId)),
	});

	if (!player) {
		throw createGraphQLError("Not authorized to configure this game", {
			extensions: { code: "NOT_AUTHORIZED" },
		});
	}

	const hasInactivityInput =
		input.autoEndTurnAfterHoursInactive !== null &&
		input.autoEndTurnAfterHoursInactive !== undefined;
	const hasPeriodicInput =
		input.autoEndTurnEveryHours !== null &&
		input.autoEndTurnEveryHours !== undefined;

	if (!hasInactivityInput && !hasPeriodicInput) {
		throw createGraphQLError("Provide at least one auto-turn setting", {
			extensions: { code: "INVALID_GAME_SETTINGS" },
		});
	}

	let inactivityHours = hasInactivityInput
		? (input.autoEndTurnAfterHoursInactive as number)
		: game.autoEndTurnAfterHoursInactive;
	let periodicHours = hasPeriodicInput
		? (input.autoEndTurnEveryHours as number)
		: game.autoEndTurnEveryHours;

	if (hasInactivityInput && !hasPeriodicInput && inactivityHours > 0) {
		periodicHours = 0;
	}

	if (hasPeriodicInput && !hasInactivityInput && periodicHours > 0) {
		inactivityHours = 0;
	}

	const valuesToValidate = [inactivityHours, periodicHours];

	if (valuesToValidate.some((value) => value < 0 || value > 48)) {
		throw createGraphQLError(
			"Auto-turn settings must be between 0 and 48 hours",
			{
				extensions: { code: "INVALID_GAME_SETTINGS" },
			},
		);
	}

	if ((inactivityHours ?? 0) > 0 && (periodicHours ?? 0) > 0) {
		throw createGraphQLError(
			"Choose either inactivity auto-end or periodic auto-end, not both",
			{
				extensions: { code: "INVALID_GAME_SETTINGS" },
			},
		);
	}

	const [updatedGame] = await ctx.drizzle
		.update(games)
		.set({
			autoEndTurnAfterHoursInactive: inactivityHours,
			autoEndTurnEveryHours: periodicHours,
		})
		.where(eq(games.id, gameId))
		.returning();

	return updatedGame;
};
