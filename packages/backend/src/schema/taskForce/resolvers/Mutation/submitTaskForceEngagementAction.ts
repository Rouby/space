import {
	and,
	eq,
	games,
	isNull,
	or,
	taskForceEngagements,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { GameEvent } from "../../../../events.js";
import { emitGameEvent } from "../../../../workers.ts";
import type { MutationResolvers } from "../../../types.generated.js";
import {
	consumeCardFromHand,
	draw,
	parseCardId,
	type RoundLogEntry,
	requireCombatState,
	resolveCard,
} from "../combatRuntime.ts";

export const submitTaskForceEngagementAction: NonNullable<
	MutationResolvers["submitTaskForceEngagementAction"]
> = async (_parent, { input }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const result = await ctx.drizzle.transaction(async (tx) => {
		const engagement = await tx.query.taskForceEngagements.findFirst({
			where: and(
				eq(taskForceEngagements.id, input.engagementId),
				or(
					eq(taskForceEngagements.ownerIdA, context.userId),
					eq(taskForceEngagements.ownerIdB, context.userId),
				),
			),
		});

		if (!engagement) {
			return context.denyAccess({
				message: "Not authorized to submit for this engagement",
				code: "NOT_AUTHORIZED",
				reason: "submit-engagement-action-not-participant",
				details: { engagementId: input.engagementId },
			});
		}

		if (engagement.resolvedAtTurn !== null) {
			throw createGraphQLError("Engagement is already resolved", {
				extensions: { code: "INVALID_COMBAT_PHASE" },
			});
		}

		if (engagement.phase !== "awaiting_submissions") {
			throw createGraphQLError("Combat round is not accepting submissions", {
				extensions: {
					code: "INVALID_COMBAT_PHASE",
					phase: engagement.phase,
				},
			});
		}

		const submittedCardId = parseCardId(input.cardId);
		const stateA = requireCombatState(engagement.stateA);
		const stateB = requireCombatState(engagement.stateB);
		const roundLog = (
			(engagement.roundLog as RoundLogEntry[] | null) ?? []
		).slice();

		const submitterIsA = engagement.ownerIdA === context.userId;
		const ownState = submitterIsA ? stateA : stateB;
		const ownSubmitted = submitterIsA
			? engagement.submittedCardIdA
			: engagement.submittedCardIdB;

		if (ownSubmitted) {
			throw createGraphQLError("Action already submitted for this round", {
				extensions: {
					code: "ROUND_ALREADY_SUBMITTED",
					round: engagement.currentRound,
				},
			});
		}

		consumeCardFromHand(ownState, submittedCardId);

		let nextSubmittedCardIdA = submitterIsA
			? submittedCardId
			: (engagement.submittedCardIdA ?? null);
		let nextSubmittedCardIdB = submitterIsA
			? (engagement.submittedCardIdB ?? null)
			: submittedCardId;
		let nextCurrentRound = engagement.currentRound;
		let nextPhase = engagement.phase;
		let nextResolvedAtTurn: number | null = engagement.resolvedAtTurn;
		let nextWinnerTaskForceId = engagement.winnerTaskForceId;
		const taskForcesToDestroy = new Set<string>();

		const emittedEvents: GameEvent[] = [
			{
				type: "taskForceEngagement:roundSubmitted",
				id: engagement.id,
				round: engagement.currentRound,
				taskForceId: ownState.taskForceId,
			},
		];

		if (nextSubmittedCardIdA && nextSubmittedCardIdB) {
			const resolutionOrder =
				stateA.taskForceId.localeCompare(stateB.taskForceId) <= 0
					? [
							{
								attacker: stateA,
								target: stateB,
								cardId: parseCardId(nextSubmittedCardIdA),
							},
							{
								attacker: stateB,
								target: stateA,
								cardId: parseCardId(nextSubmittedCardIdB),
							},
						]
					: [
							{
								attacker: stateB,
								target: stateA,
								cardId: parseCardId(nextSubmittedCardIdB),
							},
							{
								attacker: stateA,
								target: stateB,
								cardId: parseCardId(nextSubmittedCardIdA),
							},
						];

			for (const action of resolutionOrder) {
				const entry = resolveCard({
					attacker: action.attacker,
					target: action.target,
					cardId: action.cardId,
					round: engagement.currentRound,
				});
				roundLog.push(entry);

				emittedEvents.push({
					type: "taskForceEngagement:weaponFired",
					id: engagement.id,
					attackerShipId: entry.attackerTaskForceId,
					targetShipId: entry.targetTaskForceId,
					weaponComponentId: entry.cardId,
					weaponComponentPosition: 0,
					damage: entry.resolvedValue,
					round: engagement.currentRound,
					effectType: entry.effectType,
					resolvedValue: entry.resolvedValue,
				});
			}

			nextSubmittedCardIdA = null;
			nextSubmittedCardIdB = null;

			const combatResolved = stateA.hp <= 0 || stateB.hp <= 0;

			emittedEvents.push({
				type: "taskForceEngagement:roundResolved",
				id: engagement.id,
				round: engagement.currentRound,
			});

			if (combatResolved) {
				nextPhase = "completed";
				const [game] = await tx
					.select({ turnNumber: games.turnNumber })
					.from(games)
					.where(eq(games.id, engagement.gameId));
				nextResolvedAtTurn = game?.turnNumber ?? engagement.startedAtTurn;
				if (stateA.hp > stateB.hp) {
					nextWinnerTaskForceId = stateA.taskForceId;
				} else if (stateB.hp > stateA.hp) {
					nextWinnerTaskForceId = stateB.taskForceId;
				}

				emittedEvents.push({
					type: "taskForceEngagement:ended",
					id: engagement.id,
				});

				if (stateA.hp <= 0) {
					taskForcesToDestroy.add(stateA.taskForceId);
				}

				if (stateB.hp <= 0) {
					taskForcesToDestroy.add(stateB.taskForceId);
				}
			} else {
				draw(stateA, 1);
				draw(stateB, 1);
				nextCurrentRound = engagement.currentRound + 1;
				nextPhase = "awaiting_submissions";
			}
		}

		const [updated] = await tx
			.update(taskForceEngagements)
			.set({
				stateA,
				stateB,
				submittedCardIdA: nextSubmittedCardIdA,
				submittedCardIdB: nextSubmittedCardIdB,
				phase: nextPhase,
				currentRound: nextCurrentRound,
				roundLog,
				resolvedAtTurn: nextResolvedAtTurn,
				winnerTaskForceId: nextWinnerTaskForceId,
			})
			.where(
				and(
					eq(taskForceEngagements.id, engagement.id),
					submitterIsA
						? isNull(taskForceEngagements.submittedCardIdA)
						: isNull(taskForceEngagements.submittedCardIdB),
				),
			)
			.returning();

		if (!updated) {
			throw createGraphQLError("Action already submitted for this round", {
				extensions: {
					code: "ROUND_ALREADY_SUBMITTED",
					round: engagement.currentRound,
				},
			});
		}

		for (const taskForceId of taskForcesToDestroy) {
			await tx
				.update(taskForces)
				.set({ deletedAt: new Date() })
				.where(
					and(eq(taskForces.id, taskForceId), isNull(taskForces.deletedAt)),
				);
			emittedEvents.push({
				type: "taskForce:destroyed",
				id: taskForceId,
			});
		}

		return { updated, emittedEvents };
	});

	for (const event of result.emittedEvents) {
		emitGameEvent(result.updated.gameId, event);
	}

	return result.updated;
};
