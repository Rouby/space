import type { CardId } from "./combatRuntime.js";

export type CombatProfile = {
	hasWeapons: boolean;
	hasHeavyWeapons: boolean;
	hasShields: boolean;
	hasThrusters: boolean;
	hasSensors: boolean;
	hasCrew: boolean;
};

// Minimal subset of component stats needed for profile derivation
export type ComponentStats = {
	structuralIntegrity?: string | number | null;
	armorThickness?: string | number | null;
	weaponDamage?: string | number | null;
	shieldStrength?: string | number | null;
	thruster?: string | number | null;
	sensorPrecision?: string | number | null;
	crewCapacity?: string | number | null;
	crewNeed?: string | number | null;
};

export type BattleSubsystems = {
	maxHp: number;
	shieldMaxHp: number;
	armorRating: number;
	weaponRating: number;
	thrusterRating: number;
	sensorRating: number;
};

type ProfileRequirement = keyof CombatProfile;

export const CARD_REQUIREMENTS: Record<CardId, ProfileRequirement[]> = {
	laser_burst: ["hasWeapons"],
	overcharge_barrage: ["hasHeavyWeapons"],
	shield_pulse: ["hasShields"],
	evasive_maneuver: ["hasThrusters"],
	target_lock: ["hasSensors"],
	emergency_repairs: ["hasCrew"],
	retreat: [],
};

const REQUIRED_CAPABILITY_LABEL: Record<ProfileRequirement, string> = {
	hasWeapons: "weapon components",
	hasHeavyWeapons: "heavy weapon components (damage ≥ 2)",
	hasShields: "shield components",
	hasThrusters: "thruster components",
	hasSensors: "sensor components",
	hasCrew: "crew components",
};

export function getRequiredCapabilityLabel(req: ProfileRequirement): string {
	return REQUIRED_CAPABILITY_LABEL[req];
}

function num(v: string | number | null | undefined): number {
	if (v == null) return 0;
	return Number(v);
}

export function deriveSubsystems(
	components: ComponentStats[],
	fallbackHp = 7,
): BattleSubsystems {
	let structure = 0;
	let shield = 0;
	let armor = 0;
	let weapon = 0;
	let thruster = 0;
	let sensor = 0;

	for (const c of components) {
		structure += num(c.structuralIntegrity);
		shield += num(c.shieldStrength);
		armor += num(c.armorThickness);
		weapon += num(c.weaponDamage);
		thruster += num(c.thruster);
		sensor += num(c.sensorPrecision);
	}

	const maxHp = Math.floor(structure);
	return {
		maxHp: maxHp > 0 ? maxHp : fallbackHp,
		shieldMaxHp: Math.max(0, Math.floor(shield)),
		armorRating: Math.max(0, Math.floor(armor)),
		weaponRating: Math.max(0, Math.floor(weapon)),
		thrusterRating: Math.max(0, Math.floor(thruster)),
		sensorRating: Math.max(0, Math.floor(sensor)),
	};
}

export function deriveCombatProfile(
	components: ComponentStats[],
): CombatProfile {
	let hasWeapons = false;
	let hasHeavyWeapons = false;
	let hasShields = false;
	let hasThrusters = false;
	let hasSensors = false;
	let hasCrew = false;

	for (const c of components) {
		const wd = num(c.weaponDamage);
		if (wd > 0) hasWeapons = true;
		if (wd >= 2) hasHeavyWeapons = true;
		if (num(c.shieldStrength) > 0) hasShields = true;
		if (num(c.thruster) > 0) hasThrusters = true;
		if (num(c.sensorPrecision) > 0) hasSensors = true;
		if (num(c.crewCapacity) > 0 || num(c.crewNeed) > 0) hasCrew = true;
	}

	return {
		hasWeapons,
		hasHeavyWeapons,
		hasShields,
		hasThrusters,
		hasSensors,
		hasCrew,
	};
}

export function isCardEligible(
	cardId: CardId,
	profile: CombatProfile,
): true | ProfileRequirement {
	const reqs = CARD_REQUIREMENTS[cardId];
	for (const req of reqs) {
		if (!profile[req]) return req;
	}
	return true;
}

const ELIGIBLE_ORDER: CardId[] = [
	"laser_burst",
	"overcharge_barrage",
	"target_lock",
	"shield_pulse",
	"evasive_maneuver",
	"emergency_repairs",
];

/**
 * Returns the ordered list of card IDs whose profile requirements are
 * satisfied. `retreat` is never put into a deck.
 */
export function eligibleCardIds(profile: CombatProfile): CardId[] {
	return ELIGIBLE_ORDER.filter((id) => isCardEligible(id, profile) === true);
}

/**
 * Builds a 12-card starter deck from eligible cards, assigning 2 copies
 * each until the deck is full. Cards are filled in ELIGIBLE_ORDER priority.
 */
export function buildStarterDeck(profile: CombatProfile): CardId[] {
	const eligible = eligibleCardIds(profile);
	const deck: CardId[] = [];
	for (const cardId of eligible) {
		deck.push(cardId, cardId);
		if (deck.length >= 12) break;
	}
	return deck.slice(0, 12);
}
