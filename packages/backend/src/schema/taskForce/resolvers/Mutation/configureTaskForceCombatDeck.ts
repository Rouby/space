import {
	and,
	eq,
	inArray,
	isNull,
	shipComponents,
	shipDesignComponents,
	taskForceShipDesigns,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "../../../types.generated.js";
import {
	CARD_REQUIREMENTS,
	deriveCombatProfile,
	getRequiredCapabilityLabel,
	isCardEligible,
} from "../combatProfileLogic.js";
import type { CardId } from "../combatRuntime.js";

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

function validateDeckStructure(cardIds: string[]) {
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
			isNull(taskForces.deletedAt),
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

	// Validate structure first (size, duplicates, allowed pool) before touching DB for profile
	validateDeckStructure(input.cardIds);

	// Require at least one ship design to be assigned before saving a deck
	const assignedDesigns = await ctx.drizzle
		.select({ shipDesignId: taskForceShipDesigns.shipDesignId })
		.from(taskForceShipDesigns)
		.where(eq(taskForceShipDesigns.taskForceId, input.taskForceId));

	if (assignedDesigns.length === 0) {
		throw createGraphQLError(
			"Task force has no assigned ship designs — assign at least one ship design before configuring a combat deck",
			{
				extensions: {
					code: "DECK_PROFILE_REQUIRED",
					taskForceId: input.taskForceId,
				},
			},
		);
	}

	// Derive combat profile from all assigned ship designs' components
	const allComponents = await ctx.drizzle
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
			eq(shipDesignComponents.shipDesignId, taskForceShipDesigns.shipDesignId),
		)
		.innerJoin(
			shipComponents,
			eq(shipComponents.id, shipDesignComponents.shipComponentId),
		)
		.where(
			inArray(
				taskForceShipDesigns.shipDesignId,
				assignedDesigns.map((d) => d.shipDesignId),
			),
		);

	const profile = deriveCombatProfile(allComponents);

	// Validate profile eligibility for every card in the deck (deduplicated)
	const uniqueCardIds = [...new Set(input.cardIds)] as CardId[];
	for (const cardId of uniqueCardIds) {
		const eligibilityResult = isCardEligible(cardId, profile);
		if (eligibilityResult !== true) {
			const reqs = CARD_REQUIREMENTS[cardId];
			const missing = reqs.filter((r) => !profile[r]);
			throw createGraphQLError(
				`Card "${cardId}" requires ${missing.map(getRequiredCapabilityLabel).join(" and ")} but the task force does not have it`,
				{
					extensions: {
						code: "CARD_NOT_ELIGIBLE",
						cardId,
						requiredCapability: eligibilityResult,
					},
				},
			);
		}
	}

	const [updated] = await ctx.drizzle
		.update(taskForces)
		.set({ combatDeck: input.cardIds })
		.where(
			and(
				eq(taskForces.id, taskForce.id),
				eq(taskForces.ownerId, context.userId),
				isNull(taskForces.deletedAt),
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
