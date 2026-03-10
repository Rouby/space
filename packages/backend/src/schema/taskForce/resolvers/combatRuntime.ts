import { createGraphQLError } from "graphql-yoga";

export type CardId =
	| "laser_burst"
	| "target_lock"
	| "emergency_repairs"
	| "shield_pulse"
	| "evasive_maneuver"
	| "overcharge_barrage";

export type CombatState = {
	taskForceId: string;
	hp: number;
	maxHp: number;
	hand: CardId[];
	deck: CardId[];
	discard: CardId[];
	nextDamageBonus: number;
	nextDamageReduction: number;
};

export type RoundLogEntry = {
	round: number;
	attackerTaskForceId: string;
	targetTaskForceId: string;
	cardId: CardId;
	effectType: "damage" | "buff" | "special";
	resolvedValue: number;
	attackerHpAfter: number;
	targetHpAfter: number;
};

const CARD_POOL: readonly CardId[] = [
	"laser_burst",
	"target_lock",
	"emergency_repairs",
	"shield_pulse",
	"evasive_maneuver",
	"overcharge_barrage",
];

function isCardId(value: string): value is CardId {
	return CARD_POOL.includes(value as CardId);
}

export function parseCardId(value: string): CardId {
	if (!isCardId(value)) {
		throw createGraphQLError("Card is not allowed in MVP deck", {
			extensions: {
				code: "CARD_NOT_ALLOWED",
				cardId: value,
			},
		});
	}
	return value;
}

export function requireCombatState(value: unknown): CombatState {
	if (!value || typeof value !== "object") {
		throw createGraphQLError("Combat state is invalid", {
			extensions: {
				code: "COMBAT_STATE_INVALID",
			},
		});
	}

	const state = value as CombatState;
	if (
		typeof state.taskForceId !== "string" ||
		typeof state.hp !== "number" ||
		typeof state.maxHp !== "number" ||
		!Array.isArray(state.hand) ||
		!Array.isArray(state.deck)
	) {
		throw createGraphQLError("Combat state is invalid", {
			extensions: {
				code: "COMBAT_STATE_INVALID",
			},
		});
	}

	return {
		taskForceId: state.taskForceId,
		hp: state.hp,
		maxHp: state.maxHp,
		hand: state.hand.map(parseCardId),
		deck: state.deck.map(parseCardId),
		discard: (state.discard ?? []).map(parseCardId),
		nextDamageBonus: Number(state.nextDamageBonus ?? 0),
		nextDamageReduction: Number(state.nextDamageReduction ?? 0),
	};
}

export function shuffle<T>(array: T[]) {
	let currentIndex = array.length;
	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex] as T,
			array[currentIndex] as T,
		];
	}
	return array;
}

export function draw(state: CombatState, amount: number) {
	for (let i = 0; i < amount; i += 1) {
		if (state.deck.length === 0) {
			if (state.discard.length === 0) break;
			state.deck = shuffle(state.discard);
			state.discard = [];
		}
		const card = state.deck.shift();
		if (card) {
			state.hand.push(card);
		}
	}
}

export function consumeCardFromHand(state: CombatState, cardId: CardId) {
	const index = state.hand.indexOf(cardId);
	if (index < 0) {
		throw createGraphQLError("Card was not in hand", {
			extensions: {
				code: "CARD_NOT_IN_HAND",
				taskForceId: state.taskForceId,
				cardId,
			},
		});
	}

	state.hand.splice(index, 1);
}

export function resolveCard({
	attacker,
	target,
	cardId,
	round,
}: {
	attacker: CombatState;
	target: CombatState;
	cardId: CardId;
	round: number;
}): RoundLogEntry {
	let resolvedValue = 0;
	let effectType: "damage" | "buff" | "special" = "special";

	switch (cardId) {
		case "laser_burst": {
			const raw = 2 + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			const reduction = target.nextDamageReduction;
			target.nextDamageReduction = 0;
			resolvedValue = Math.max(0, raw - reduction);
			target.hp = Math.max(0, target.hp - resolvedValue);
			effectType = "damage";
			break;
		}
		case "overcharge_barrage": {
			const raw = 3 + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			const reduction = target.nextDamageReduction;
			target.nextDamageReduction = 0;
			resolvedValue = Math.max(0, raw - reduction);
			target.hp = Math.max(0, target.hp - resolvedValue);
			effectType = "damage";
			break;
		}
		case "target_lock": {
			attacker.nextDamageBonus += 1;
			resolvedValue = 1;
			effectType = "buff";
			break;
		}
		case "shield_pulse":
		case "evasive_maneuver": {
			attacker.nextDamageReduction += 1;
			resolvedValue = 1;
			effectType = "buff";
			break;
		}
		case "emergency_repairs": {
			const before = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + 1);
			resolvedValue = attacker.hp - before;
			effectType = "special";
			break;
		}
	}

	return {
		round,
		attackerTaskForceId: attacker.taskForceId,
		targetTaskForceId: target.taskForceId,
		cardId,
		effectType,
		resolvedValue,
		attackerHpAfter: attacker.hp,
		targetHpAfter: target.hp,
	};
}
