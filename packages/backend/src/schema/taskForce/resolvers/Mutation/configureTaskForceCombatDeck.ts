import { and, eq, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";

const ALLOWED_CARD_IDS = [
	"laser_burst",
	"target_lock",
	"emergency_repairs",
	"shield_pulse",
	"evasive_maneuver",
	"overcharge_barrage",
] as const;

const DECK_SIZE = 12;
const MAX_DUPLICATES = 2;

export const STARTER_COMBAT_DECK: string[] = [
	"laser_burst",
	"laser_burst",
	"target_lock",
	"target_lock",
	"emergency_repairs",
	"emergency_repairs",
	"shield_pulse",
	"shield_pulse",
	"evasive_maneuver",
	"evasive_maneuver",
	"overcharge_barrage",
	"overcharge_barrage",
];

function validateDeck(cardIds: string[]) {
	if (cardIds.length !== DECK_SIZE) {
		throw createGraphQLError("Combat deck must contain exactly 12 cards", {
			extensions: {
				code: "INVALID_DECK_SIZE",
				required: DECK_SIZE,
				actual: cardIds.length,
			},
		});
	}

	const counts = new Map<string, number>();
	for (const cardId of cardIds) {
		if (
			!ALLOWED_CARD_IDS.includes(cardId as (typeof ALLOWED_CARD_IDS)[number])
		) {
			throw createGraphQLError("Card is not allowed in MVP deck", {
				extensions: {
					code: "CARD_NOT_ALLOWED",
					cardId,
				},
			});
		}

		const next = (counts.get(cardId) ?? 0) + 1;
		if (next > MAX_DUPLICATES) {
			throw createGraphQLError("Duplicate limit exceeded for card", {
				extensions: {
					code: "DUPLICATE_CARD_LIMIT_EXCEEDED",
					cardId,
					maxDuplicates: MAX_DUPLICATES,
				},
			});
		}
		counts.set(cardId, next);
	}
}

export const configureTaskForceCombatDeck: NonNullable<
	MutationResolvers["configureTaskForceCombatDeck"]
> = async (_parent, { input }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.id, input.taskForceId),
			eq(taskForces.ownerId, context.userId),
		),
	});

	if (!taskForce) {
		return context.denyAccess({
			message: "Task force not found",
			code: "NOT_AUTHORIZED",
			reason: "configure-task-force-deck-not-owner",
			details: { taskForceId: input.taskForceId },
		});
	}

	validateDeck(input.cardIds);

	const [updated] = await ctx.drizzle
		.update(taskForces)
		.set({ combatDeck: input.cardIds })
		.where(
			and(
				eq(taskForces.id, taskForce.id),
				eq(taskForces.ownerId, context.userId),
			),
		)
		.returning();

	if (!updated) {
		return context.denyAccess({
			message: "Task force not found",
			code: "NOT_AUTHORIZED",
			reason: "configure-task-force-deck-update-denied",
			details: { taskForceId: input.taskForceId },
		});
	}

	return { ...updated, isVisible: true, lastUpdate: null };
};
