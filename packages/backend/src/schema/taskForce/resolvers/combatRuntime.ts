import { createGraphQLError } from "graphql-yoga";

export type CardId =
	| "laser_burst"
	| "target_lock"
	| "emergency_repairs"
	| "shield_pulse"
	| "evasive_maneuver"
	| "overcharge_barrage"
	| "retreat";

export type CombatState = {
	taskForceId: string;
	hp: number;
	maxHp: number;
	shieldHp: number;
	shieldMaxHp: number;
	armorRating: number;
	weaponRating: number;
	thrusterRating: number;
	sensorRating: number;
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
	shieldDamage: number;
	armorAbsorbed: number;
	hullDamage: number;
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
	if (value === "retreat") {
		return "retreat";
	}
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
		shieldHp: Number(state.shieldHp ?? 0),
		shieldMaxHp: Number(state.shieldMaxHp ?? 0),
		armorRating: Number(state.armorRating ?? 0),
		weaponRating: Number(state.weaponRating ?? 0),
		thrusterRating: Number(state.thrusterRating ?? 0),
		sensorRating: Number(state.sensorRating ?? 0),
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
	let shieldDamage = 0;
	let armorAbsorbed = 0;
	let hullDamage = 0;
	let effectType: "damage" | "buff" | "special" = "special";

	function applyDamage({
		rawDamage,
		ignoreArmor,
	}: {
		rawDamage: number;
		ignoreArmor: boolean;
	}) {
		const shielded = Math.min(rawDamage, target.shieldHp);
		target.shieldHp -= shielded;
		shieldDamage = shielded;

		const postShield = rawDamage - shielded;
		const reduction = target.nextDamageReduction;
		target.nextDamageReduction = 0;

		const armor = ignoreArmor ? 0 : target.armorRating;
		armorAbsorbed = Math.min(postShield, armor);
		const reducedByArmor = postShield - armorAbsorbed;
		hullDamage = Math.max(0, reducedByArmor - reduction);

		resolvedValue = hullDamage;
		target.hp = Math.max(0, target.hp - hullDamage);
		effectType = "damage";
	}

	switch (cardId) {
		case "retreat": {
			// Retreat doesn't do anything in terms of damage or buffs, but we want to log it as a special action
			resolvedValue = 0;
			effectType = "special";
			break;
		}
		case "laser_burst": {
			const raw = attacker.weaponRating + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			applyDamage({ rawDamage: raw, ignoreArmor: false });
			break;
		}
		case "overcharge_barrage": {
			const raw = attacker.weaponRating + attacker.nextDamageBonus;
			attacker.nextDamageBonus = 0;
			applyDamage({ rawDamage: raw, ignoreArmor: true });
			break;
		}
		case "target_lock": {
			attacker.nextDamageBonus += attacker.sensorRating;
			resolvedValue = attacker.sensorRating;
			effectType = "buff";
			break;
		}
		case "evasive_maneuver": {
			attacker.nextDamageReduction += attacker.thrusterRating;
			resolvedValue = attacker.thrusterRating;
			effectType = "buff";
			break;
		}
		case "shield_pulse": {
			attacker.nextDamageReduction += attacker.shieldMaxHp;
			resolvedValue = attacker.shieldMaxHp;
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
		shieldDamage,
		armorAbsorbed,
		hullDamage,
		attackerHpAfter: attacker.hp,
		targetHpAfter: target.hp,
	};
}
