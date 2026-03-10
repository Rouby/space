import { eq, taskForceEngagements, taskForces } from "@space/data/schema";
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
const EPSILON = 1e-9;
const NEAR_MISS_RADIUS = 25;
const NEAR_MISS_RADIUS_SQ = NEAR_MISS_RADIUS * NEAR_MISS_RADIUS;

type Point = { x: number; y: number };
type Segment = { start: Point; end: Point };

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

function distanceSquared(a: Point, b: Point) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return dx * dx + dy * dy;
}

function cross(a: Point, b: Point, c: Point) {
	return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function isAlmostZero(value: number) {
	return Math.abs(value) <= EPSILON;
}

function onSegment(a: Point, b: Point, p: Point) {
	return (
		Math.min(a.x, b.x) - EPSILON <= p.x &&
		p.x <= Math.max(a.x, b.x) + EPSILON &&
		Math.min(a.y, b.y) - EPSILON <= p.y &&
		p.y <= Math.max(a.y, b.y) + EPSILON
	);
}

function segmentsIntersect(a: Segment, b: Segment) {
	const d1 = cross(a.start, a.end, b.start);
	const d2 = cross(a.start, a.end, b.end);
	const d3 = cross(b.start, b.end, a.start);
	const d4 = cross(b.start, b.end, a.end);

	if (
		((d1 > EPSILON && d2 < -EPSILON) || (d1 < -EPSILON && d2 > EPSILON)) &&
		((d3 > EPSILON && d4 < -EPSILON) || (d3 < -EPSILON && d4 > EPSILON))
	) {
		return true;
	}

	if (isAlmostZero(d1) && onSegment(a.start, a.end, b.start)) {
		return true;
	}
	if (isAlmostZero(d2) && onSegment(a.start, a.end, b.end)) {
		return true;
	}
	if (isAlmostZero(d3) && onSegment(b.start, b.end, a.start)) {
		return true;
	}
	if (isAlmostZero(d4) && onSegment(b.start, b.end, a.end)) {
		return true;
	}

	return false;
}

function dot(a: Point, b: Point) {
	return a.x * b.x + a.y * b.y;
}

function subtract(a: Point, b: Point): Point {
	return { x: a.x - b.x, y: a.y - b.y };
}

function distancePointToSegmentSquared(p: Point, s: Segment) {
	const segment = subtract(s.end, s.start);
	const lengthSquared = dot(segment, segment);
	if (lengthSquared <= EPSILON) {
		return distanceSquared(p, s.start);
	}

	const t = Math.max(
		0,
		Math.min(1, dot(subtract(p, s.start), segment) / lengthSquared),
	);
	const projection = {
		x: s.start.x + segment.x * t,
		y: s.start.y + segment.y * t,
	};

	return distanceSquared(p, projection);
}

function distanceSegmentToSegmentSquared(a: Segment, b: Segment) {
	if (segmentsIntersect(a, b)) {
		return 0;
	}

	return Math.min(
		distancePointToSegmentSquared(a.start, b),
		distancePointToSegmentSquared(a.end, b),
		distancePointToSegmentSquared(b.start, a),
		distancePointToSegmentSquared(b.end, a),
	);
}

function isSwap(a: Segment, b: Segment) {
	return (
		distanceSquared(a.start, b.end) <= EPSILON &&
		distanceSquared(a.end, b.start) <= EPSILON
	);
}

function buildMovementSegment({
	position,
	movementVector,
}: {
	position: Point;
	movementVector: Point | null;
}): Segment {
	const vector = movementVector ?? { x: 0, y: 0 };
	return {
		start: {
			x: position.x - vector.x,
			y: position.y - vector.y,
		},
		end: { x: position.x, y: position.y },
	};
}

function areTaskForcesContested(a: Segment, b: Segment) {
	if (segmentsIntersect(a, b)) {
		return true;
	}

	if (isSwap(a, b)) {
		return true;
	}

	return distanceSegmentToSegmentSquared(a, b) <= NEAR_MISS_RADIUS_SQ;
}

export async function tickTaskForceCombat(tx: Transaction, ctx: Context) {
	const allTaskForces = await tx
		.select({
			id: taskForces.id,
			ownerId: taskForces.ownerId,
			position: taskForces.position,
			movementVector: taskForces.movementVector,
			combatDeck: taskForces.combatDeck,
		})
		.from(taskForces)
		.where(eq(taskForces.gameId, gameId));

	const candidates: Array<{ leftId: string; rightId: string }> = [];

	for (let i = 0; i + 1 < allTaskForces.length; i += 1) {
		const left = allTaskForces[i];
		for (let j = i + 1; j < allTaskForces.length; j += 1) {
			const right = allTaskForces[j];
			if (left.ownerId === right.ownerId) {
				continue;
			}

			const leftSegment = buildMovementSegment(left);
			const rightSegment = buildMovementSegment(right);

			if (!areTaskForcesContested(leftSegment, rightSegment)) {
				continue;
			}

			const [leftId, rightId] =
				left.id.localeCompare(right.id) <= 0
					? [left.id, right.id]
					: [right.id, left.id];

			candidates.push({ leftId, rightId });
		}
	}

	const taskForcesById = new Map(
		allTaskForces.map((taskForce) => [taskForce.id, taskForce]),
	);

	const uniqueCandidates = new Map<
		string,
		{ leftId: string; rightId: string }
	>();
	for (const candidate of candidates) {
		uniqueCandidates.set(`${candidate.leftId}:${candidate.rightId}`, candidate);
	}

	const sortedCandidates = [...uniqueCandidates.values()].sort((a, b) => {
		if (a.leftId === b.leftId) {
			return a.rightId.localeCompare(b.rightId);
		}
		return a.leftId.localeCompare(b.leftId);
	});

	const engagedTaskForces = new Set<string>();
	for (const candidate of sortedCandidates) {
		if (
			engagedTaskForces.has(candidate.leftId) ||
			engagedTaskForces.has(candidate.rightId)
		) {
			continue;
		}

		const left = taskForcesById.get(candidate.leftId);
		const right = taskForcesById.get(candidate.rightId);
		if (!left || !right) {
			continue;
		}

		engagedTaskForces.add(left.id);
		engagedTaskForces.add(right.id);

		const engagementId = `${ctx.turn}:${left.id}:${right.id}`;
		const engagementPosition = {
			x: (left.position.x + right.position.x) / 2,
			y: (left.position.y + right.position.y) / 2,
		};

		await tx.insert(taskForceEngagements).values({
			id: engagementId,
			gameId,
			taskForceIdA: left.id,
			taskForceIdB: right.id,
			ownerIdA: left.ownerId,
			ownerIdB: right.ownerId,
			position: engagementPosition,
			startedAtTurn: ctx.turn,
		});

		ctx.postMessage({
			type: "taskForceEngagement:started",
			id: engagementId,
			taskForceIdA: left.id,
			taskForceIdB: right.id,
			position: engagementPosition,
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

		await tx
			.update(taskForceEngagements)
			.set({ resolvedAtTurn: ctx.turn })
			.where(eq(taskForceEngagements.id, engagementId));

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
