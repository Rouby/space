import { eq, taskForces } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

type CardId =
	| "laser_burst"
	| "target_lock"
	| "emergency_repairs"
	| "shield_pulse"
	| "evasive_maneuver"
	| "overcharge_barrage";

type CombatRuleViolationCode =
	| "CARD_PLAY_LIMIT_EXCEEDED"
	| "CARD_NOT_IN_HAND"
	| "COMBAT_STATE_INVALID";

const CARD_POOL: readonly CardId[] = [
	"laser_burst",
	"target_lock",
	"emergency_repairs",
	"shield_pulse",
	"evasive_maneuver",
	"overcharge_barrage",
];

const DECK_SIZE = 12;
const MAX_DUPLICATES = 2;
const STARTING_HAND = 3;
const MAX_ROUNDS = 3;
const STARTING_HP = 6;

type CombatState = {
	taskForceId: string;
	hp: number;
	maxHp: number;
	hand: CardId[];
	deck: CardId[];
	nextDamageBonus: number;
	nextDamageReduction: number;
};

class CombatRuleViolation extends Error {
	public readonly code: CombatRuleViolationCode;
	public readonly details: Record<string, unknown>;

	constructor(
		code: CombatRuleViolationCode,
		message: string,
		details: Record<string, unknown>,
	) {
		super(message);
		this.name = "CombatRuleViolation";
		this.code = code;
		this.details = details;
	}
}

function isCardId(value: string): value is CardId {
	return CARD_POOL.includes(value as CardId);
}

function isValidDeck(deck: string[]): deck is CardId[] {
	if (deck.length !== DECK_SIZE) {
		return false;
	}

	const counts = new Map<string, number>();
	for (const cardId of deck) {
		if (!isCardId(cardId)) {
			return false;
		}
		const next = (counts.get(cardId) ?? 0) + 1;
		if (next > MAX_DUPLICATES) {
			return false;
		}
		counts.set(cardId, next);
	}

	return true;
}

function assertValidDeck(deck: string[], taskForceId: string): CardId[] {
	if (isValidDeck(deck)) {
		return [...deck];
	}

	throw new CombatRuleViolation(
		"COMBAT_STATE_INVALID",
		"Task force has invalid combat deck state",
		{ taskForceId, deckLength: deck.length },
	);
}

function draw(state: CombatState, amount: number) {
	for (let i = 0; i < amount && state.deck.length > 0; i += 1) {
		const card = state.deck.shift();
		if (card) {
			state.hand.push(card);
		}
	}
}

function drawCardFromHand(state: CombatState) {
	if (state.hand.length === 0) {
		return null;
	}

	const card = state.hand.shift();
	if (!card) {
		throw new CombatRuleViolation("CARD_NOT_IN_HAND", "Card was not in hand", {
			taskForceId: state.taskForceId,
		});
	}

	return card;
}

function resolveCard({
	attacker,
	target,
	cardId,
	round,
	engagementId,
	ctx,
}: {
	attacker: CombatState;
	target: CombatState;
	cardId: CardId;
	round: number;
	engagementId: string;
	ctx: Context;
}) {
	let resolvedValue = 0;

	switch (cardId) {
		case "laser_burst": {
			const raw = 2 + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			const reduction = target.nextDamageReduction;
			target.nextDamageReduction = 0;
			resolvedValue = Math.max(0, raw - reduction);
			target.hp = Math.max(0, target.hp - resolvedValue);
			break;
		}
		case "overcharge_barrage": {
			const raw = 3 + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			const reduction = target.nextDamageReduction;
			target.nextDamageReduction = 0;
			resolvedValue = Math.max(0, raw - reduction);
			target.hp = Math.max(0, target.hp - resolvedValue);
			break;
		}
		case "target_lock": {
			attacker.nextDamageBonus += 1;
			resolvedValue = 1;
			break;
		}
		case "shield_pulse":
		case "evasive_maneuver": {
			attacker.nextDamageReduction += 1;
			resolvedValue = 1;
			break;
		}
		case "emergency_repairs": {
			const before = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + 1);
			resolvedValue = attacker.hp - before;
			break;
		}
	}

	ctx.postMessage({
		type: "taskForceEngagement:weaponFired",
		id: engagementId,
		attackerShipId: attacker.taskForceId,
		targetShipId: target.taskForceId,
		weaponComponentId: cardId,
		weaponComponentPosition: 0,
		damage: resolvedValue,
		round,
		effectType:
			cardId === "laser_burst" || cardId === "overcharge_barrage"
				? "damage"
				: cardId === "target_lock" ||
						cardId === "shield_pulse" ||
						cardId === "evasive_maneuver"
					? "buff"
					: "special",
		resolvedValue,
	});
}

export async function tickTaskForceCombat(tx: Transaction, ctx: Context) {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			position: taskForces.position,
			combatDeck: taskForces.combatDeck,
		})
		.from(taskForces)
		.where(eq(taskForces.gameId, gameId));

	const byPosition = new Map<string, Array<(typeof allTaskForces)[number]>>();
	for (const tf of allTaskForces) {
		const key = `${tf.position.x},${tf.position.y}`;
		const list = byPosition.get(key) ?? [];
		list.push(tf);
		byPosition.set(key, list);
	}

	for (const atPosition of byPosition.values()) {
		const sorted = [...atPosition].sort((a, b) => a.id.localeCompare(b.id));
		for (let i = 0; i + 1 < sorted.length; i += 2) {
			const left = sorted[i];
			const right = sorted[i + 1];
			const engagementId = `${ctx.turn}:${left.id}:${right.id}`;

			ctx.postMessage({
				type: "taskForceEngagement:started",
				id: engagementId,
				taskForceIdA: left.id,
				taskForceIdB: right.id,
				position: left.position,
			});

			const sideA: CombatState = {
				taskForceId: left.id,
				hp: STARTING_HP,
				maxHp: STARTING_HP,
				hand: [],
				deck: assertValidDeck(left.combatDeck ?? [], left.id),
				nextDamageBonus: 0,
				nextDamageReduction: 0,
			};
			const sideB: CombatState = {
				taskForceId: right.id,
				hp: STARTING_HP,
				maxHp: STARTING_HP,
				hand: [],
				deck: assertValidDeck(right.combatDeck ?? [], right.id),
				nextDamageBonus: 0,
				nextDamageReduction: 0,
			};

			draw(sideA, STARTING_HAND);
			draw(sideB, STARTING_HAND);

			for (let round = 1; round <= MAX_ROUNDS; round += 1) {
				const playsThisRound = new Map<string, number>();
				const sequence =
					sideA.taskForceId.localeCompare(sideB.taskForceId) <= 0
						? [
								{ attacker: sideA, target: sideB },
								{ attacker: sideB, target: sideA },
							]
						: [
								{ attacker: sideB, target: sideA },
								{ attacker: sideA, target: sideB },
							];

				for (const pair of sequence) {
					if (pair.attacker.hp <= 0 || pair.target.hp <= 0) {
						continue;
					}

					const playCount = playsThisRound.get(pair.attacker.taskForceId) ?? 0;
					if (playCount >= 1) {
						throw new CombatRuleViolation(
							"CARD_PLAY_LIMIT_EXCEEDED",
							"Task force attempted to play more than one card in a round",
							{ taskForceId: pair.attacker.taskForceId, round },
						);
					}

					const card = drawCardFromHand(pair.attacker);
					if (!card) {
						continue;
					}

					playsThisRound.set(pair.attacker.taskForceId, playCount + 1);
					resolveCard({
						attacker: pair.attacker,
						target: pair.target,
						cardId: card,
						round,
						engagementId,
						ctx,
					});
				}

				if (sideA.hp <= 0 || sideB.hp <= 0) {
					break;
				}

				draw(sideA, 1);
				draw(sideB, 1);
			}

			ctx.postMessage({
				type: "taskForceEngagement:ended",
				id: engagementId,
			});

			if (sideA.hp <= 0) {
				await tx.delete(taskForces).where(eq(taskForces.id, sideA.taskForceId));
				ctx.postMessage({ type: "taskForce:destroyed", id: sideA.taskForceId });
			}

			if (sideB.hp <= 0) {
				await tx.delete(taskForces).where(eq(taskForces.id, sideB.taskForceId));
				ctx.postMessage({ type: "taskForce:destroyed", id: sideB.taskForceId });
			}
		}
	}
}
