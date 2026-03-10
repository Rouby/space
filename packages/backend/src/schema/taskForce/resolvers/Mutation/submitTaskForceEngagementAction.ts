import {
	and,
	eq,
	games,
	inArray,
	isNull,
	or,
	type TurnReportSummary,
	taskForceEngagements,
	taskForces,
	turnReports,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { GameEvent } from "../../../../events.js";
import { emitGameEvent } from "../../../../workers.ts";
import type { MutationResolvers } from "../../../types.generated.js";
import {
	type CardId,
	consumeCardFromHand,
	draw,
	parseCardId,
	type RoundLogEntry,
	requireCombatState,
	resolveCard,
} from "../combatRuntime.ts";

function updateSummaryEngagementIfPresent({
	summary,
	engagementId,
	winnerTaskForceId,
}: {
	summary: TurnReportSummary;
	engagementId: string;
	winnerTaskForceId: string | null;
}): TurnReportSummary {
	if (!summary.taskForceEngagements?.length) {
		return summary;
	}

	let changed = false;
	const taskForceEngagements = summary.taskForceEngagements.map((item) => {
		if (item.engagementId !== engagementId) {
			return item;
		}

		changed = true;
		return {
			...item,
			status: "resolved" as const,
			winnerTaskForceId,
		};
	});

	if (!changed) {
		return summary;
	}

	return {
		...summary,
		taskForceEngagements,
	};
}

type ParsedSubmission =
	| { type: "retreat"; submittedCardId: "retreat" }
	| { type: "card"; submittedCardId: Exclude<CardId, "retreat"> };

function parseSubmissionInput(input: {
	action?: string | null;
	cardId?: string | null;
}): ParsedSubmission {
	const hasAction = input.action !== null && input.action !== undefined;
	const hasCardId = input.cardId !== null && input.cardId !== undefined;

	if (hasAction === hasCardId) {
		throw createGraphQLError("Provide exactly one of action or cardId", {
			extensions: { code: "BAD_USER_INPUT" },
		});
	}

	if (hasAction) {
		if (input.action !== "RETREAT") {
			throw createGraphQLError("Action is not allowed", {
				extensions: {
					code: "BAD_USER_INPUT",
					action: input.action,
				},
			});
		}

		return { type: "retreat", submittedCardId: "retreat" };
	}

	return {
		type: "card",
		submittedCardId: parseCardId(
			input.cardId as Exclude<typeof input.cardId, null | undefined>,
		) as Exclude<CardId, "retreat">,
	};
}

function resolveWinnerTaskForceId({
	stateA,
	stateB,
	submittedCardIdA,
	submittedCardIdB,
}: {
	stateA: { taskForceId: string; hp: number };
	stateB: { taskForceId: string; hp: number };
	submittedCardIdA: CardId;
	submittedCardIdB: CardId;
}): string | null {
	if (stateA.hp <= 0 && stateB.hp <= 0) {
		return null;
	}

	if (stateA.hp <= 0) {
		return stateB.taskForceId;
	}

	if (stateB.hp <= 0) {
		return stateA.taskForceId;
	}

	if (submittedCardIdA === "retreat" && submittedCardIdB === "retreat") {
		return null;
	}

	if (submittedCardIdA === "retreat") {
		return stateB.taskForceId;
	}

	if (submittedCardIdB === "retreat") {
		return stateA.taskForceId;
	}

	if (stateA.hp > stateB.hp) {
		return stateA.taskForceId;
	}

	if (stateB.hp > stateA.hp) {
		return stateB.taskForceId;
	}

	return null;
}

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

		const submission = parseSubmissionInput(input);
		const submittedCardId = submission.submittedCardId;
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

		if (submission.type === "card") {
			consumeCardFromHand(ownState, submission.submittedCardId);
		}

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
			const submittedCardIdA = parseCardId(nextSubmittedCardIdA);
			const submittedCardIdB = parseCardId(nextSubmittedCardIdB);

			const resolutionOrder =
				stateA.taskForceId.localeCompare(stateB.taskForceId) <= 0
					? [
							{
								attacker: stateA,
								target: stateB,
								cardId: submittedCardIdA,
							},
							{
								attacker: stateB,
								target: stateA,
								cardId: submittedCardIdB,
							},
						]
					: [
							{
								attacker: stateB,
								target: stateA,
								cardId: submittedCardIdB,
							},
							{
								attacker: stateA,
								target: stateB,
								cardId: submittedCardIdA,
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

			const combatResolved =
				stateA.hp <= 0 ||
				stateB.hp <= 0 ||
				nextSubmittedCardIdA === "retreat" ||
				nextSubmittedCardIdB === "retreat";

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

				nextWinnerTaskForceId = resolveWinnerTaskForceId({
					stateA,
					stateB,
					submittedCardIdA,
					submittedCardIdB,
				});

				nextSubmittedCardIdA = null;
				nextSubmittedCardIdB = null;

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
				stateA.discard.push(...stateA.hand);
				stateA.hand = [];
				stateB.discard.push(...stateB.hand);
				stateB.hand = [];
				draw(stateA, 3);
				draw(stateB, 3);
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

		if (updated.phase === "completed") {
			const participantOwnerIds = [engagement.ownerIdA, engagement.ownerIdB];
			const reports = await tx
				.select({ id: turnReports.id, summary: turnReports.summary })
				.from(turnReports)
				.where(
					and(
						eq(turnReports.gameId, engagement.gameId),
						inArray(turnReports.ownerId, participantOwnerIds),
					),
				);

			for (const report of reports) {
				const nextSummary = updateSummaryEngagementIfPresent({
					summary: report.summary,
					engagementId: engagement.id,
					winnerTaskForceId: updated.winnerTaskForceId,
				});

				if (nextSummary === report.summary) {
					continue;
				}

				await tx
					.update(turnReports)
					.set({ summary: nextSummary })
					.where(eq(turnReports.id, report.id));
			}
		}

		return { updated, emittedEvents };
	});

	for (const event of result.emittedEvents) {
		emitGameEvent(result.updated.gameId, event);
	}

	return result.updated;
};
