import {
	and,
	eq,
	isNull,
	taskForceEngagements,
	taskForces,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

type CardId =
	| "laser_burst"
	| "target_lock"
	| "emergency_repairs"
	| "shield_pulse"
	| "evasive_maneuver"
	| "overcharge_barrage";

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
	public readonly code: "COMBAT_STATE_INVALID";

	constructor(taskForceId: string, deckLength: number) {
		super(
			`Task force has invalid combat deck state: ${taskForceId} (${deckLength})`,
		);
		this.name = "CombatRuleViolation";
		this.code = "COMBAT_STATE_INVALID";
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

	throw new CombatRuleViolation(taskForceId, deck.length);
}

function draw(state: CombatState, amount: number) {
	for (let i = 0; i < amount && state.deck.length > 0; i += 1) {
		const card = state.deck.shift();
		if (card) {
			state.hand.push(card);
		}
	}
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
		.where(and(eq(taskForces.gameId, gameId), isNull(taskForces.deletedAt)));

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

		const engagementPosition = {
			x: (left.position.x + right.position.x) / 2,
			y: (left.position.y + right.position.y) / 2,
		};

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

		const [{ id: engagementId }] = await tx
			.insert(taskForceEngagements)
			.values({
				gameId,
				taskForceIdA: left.id,
				taskForceIdB: right.id,
				ownerIdA: left.ownerId,
				ownerIdB: right.ownerId,
				position: engagementPosition,
				phase: "awaiting_submissions",
				currentRound: 1,
				stateA: sideA,
				stateB: sideB,
				roundLog: [],
				startedAtTurn: ctx.turn,
			})
			.returning({ id: taskForceEngagements.id });

		await tx
			.update(taskForces)
			.set({
				position: engagementPosition,
				movementVector: null,
				orders: [],
			})
			.where(eq(taskForces.id, left.id));

		await tx
			.update(taskForces)
			.set({
				position: engagementPosition,
				movementVector: null,
				orders: [],
			})
			.where(eq(taskForces.id, right.id));

		ctx.postMessage({
			type: "taskForce:position",
			id: left.id,
			position: engagementPosition,
			movementVector: null,
		});

		ctx.postMessage({
			type: "taskForce:position",
			id: right.id,
			position: engagementPosition,
			movementVector: null,
		});

		ctx.postMessage({
			type: "taskForceEngagement:started",
			id: engagementId,
			taskForceIdA: left.id,
			taskForceIdB: right.id,
			position: engagementPosition,
		});
	}
}
