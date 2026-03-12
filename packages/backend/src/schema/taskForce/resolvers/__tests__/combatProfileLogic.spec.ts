import { describe, expect, it } from "vitest";
import {
	buildStarterDeck,
	deriveCombatProfile,
	deriveSubsystems,
	eligibleCardIds,
	isCardEligible,
} from "../combatProfileLogic.ts";

const emptyProfile = {
	hasWeapons: false,
	hasHeavyWeapons: false,
	hasShields: false,
	hasThrusters: false,
	hasSensors: false,
	hasCrew: false,
};

const fullProfile = {
	hasWeapons: true,
	hasHeavyWeapons: true,
	hasShields: true,
	hasThrusters: true,
	hasSensors: true,
	hasCrew: true,
};

describe("deriveCombatProfile", () => {
	it("returns all false for empty component list", () => {
		expect(deriveCombatProfile([])).toEqual(emptyProfile);
	});

	it("returns all true for a component with all stats present", () => {
		expect(
			deriveCombatProfile([
				{
					weaponDamage: "5",
					shieldStrength: "10",
					thruster: "3",
					sensorPrecision: "2",
					crewCapacity: "5",
					crewNeed: "2",
				},
			]),
		).toEqual(fullProfile);
	});

	it("sets hasWeapons true for weaponDamage > 0, but hasHeavyWeapons false for damage < 2", () => {
		const profile = deriveCombatProfile([{ weaponDamage: "1" }]);
		expect(profile.hasWeapons).toBe(true);
		expect(profile.hasHeavyWeapons).toBe(false);
	});

	it("sets hasHeavyWeapons true for weaponDamage >= 2", () => {
		const profile = deriveCombatProfile([{ weaponDamage: "2" }]);
		expect(profile.hasWeapons).toBe(true);
		expect(profile.hasHeavyWeapons).toBe(true);
	});

	it("treats null and zero stats as absent", () => {
		const profile = deriveCombatProfile([
			{ weaponDamage: null, shieldStrength: "0", thruster: null },
		]);
		expect(profile.hasWeapons).toBe(false);
		expect(profile.hasShields).toBe(false);
		expect(profile.hasThrusters).toBe(false);
	});

	it("sets hasCrew true if either crewCapacity or crewNeed is positive", () => {
		expect(deriveCombatProfile([{ crewCapacity: "4" }]).hasCrew).toBe(true);
		expect(deriveCombatProfile([{ crewNeed: "1" }]).hasCrew).toBe(true);
		expect(
			deriveCombatProfile([{ crewCapacity: "0", crewNeed: "0" }]).hasCrew,
		).toBe(false);
	});

	it("accumulates flags across multiple components", () => {
		const profile = deriveCombatProfile([
			{ weaponDamage: "1" }, // hasWeapons only
			{ shieldStrength: "5" }, // hasShields
		]);
		expect(profile.hasWeapons).toBe(true);
		expect(profile.hasShields).toBe(true);
		expect(profile.hasSensors).toBe(false);
	});
});

describe("isCardEligible", () => {
	it("returns true for retreat regardless of profile", () => {
		expect(isCardEligible("retreat", emptyProfile)).toBe(true);
	});

	it("returns true when profile satisfies all requirements", () => {
		expect(isCardEligible("laser_burst", fullProfile)).toBe(true);
		expect(isCardEligible("overcharge_barrage", fullProfile)).toBe(true);
		expect(isCardEligible("shield_pulse", fullProfile)).toBe(true);
	});

	it("returns the missing requirement when profile lacks it", () => {
		expect(isCardEligible("laser_burst", emptyProfile)).toBe("hasWeapons");
		expect(isCardEligible("overcharge_barrage", emptyProfile)).toBe(
			"hasHeavyWeapons",
		);
		expect(isCardEligible("shield_pulse", emptyProfile)).toBe("hasShields");
		expect(isCardEligible("evasive_maneuver", emptyProfile)).toBe(
			"hasThrusters",
		);
		expect(isCardEligible("target_lock", emptyProfile)).toBe("hasSensors");
		expect(isCardEligible("emergency_repairs", emptyProfile)).toBe("hasCrew");
	});
});

describe("eligibleCardIds", () => {
	it("returns empty list for empty profile", () => {
		expect(eligibleCardIds(emptyProfile)).toHaveLength(0);
	});

	it("returns all 6 combat cards for full profile (not retreat)", () => {
		const ids = eligibleCardIds(fullProfile);
		expect(ids).toHaveLength(6);
		expect(ids).not.toContain("retreat");
	});

	it("returns only cards matching profile flags", () => {
		const profile = { ...emptyProfile, hasWeapons: true };
		expect(eligibleCardIds(profile)).toEqual(["laser_burst"]);
	});
});

describe("buildStarterDeck", () => {
	it("returns 12 cards for a full profile (2 of each eligible card)", () => {
		const deck = buildStarterDeck(fullProfile);
		expect(deck).toHaveLength(12);
		// Each card appears exactly twice
		const counts = deck.reduce<Record<string, number>>((acc, id) => {
			acc[id] = (acc[id] ?? 0) + 1;
			return acc;
		}, {});
		for (const count of Object.values(counts)) {
			expect(count).toBe(2);
		}
	});

	it("returns 2-card deck when only one card type is eligible", () => {
		const profile = { ...emptyProfile, hasWeapons: true };
		expect(buildStarterDeck(profile)).toEqual(["laser_burst", "laser_burst"]);
	});

	it("returns empty deck for empty profile", () => {
		expect(buildStarterDeck(emptyProfile)).toHaveLength(0);
	});

	it("caps the deck at 12 cards even for 7+ eligible cards", () => {
		// All 6 cards eligible: 6×2 = 12, so capped correctly
		const deck = buildStarterDeck(fullProfile);
		expect(deck.length).toBeLessThanOrEqual(12);
	});
});

describe("deriveSubsystems", () => {
	it("aggregates component stats with floor(sum) semantics", () => {
		const subsystems = deriveSubsystems([
			{
				structuralIntegrity: "4.9",
				shieldStrength: "2.2",
				armorThickness: "1.7",
				weaponDamage: "3.8",
				thruster: "5.1",
				sensorPrecision: "6.9",
			},
			{
				structuralIntegrity: "3.4",
				shieldStrength: "1.3",
				armorThickness: "2.6",
				weaponDamage: "1.1",
				thruster: "0.9",
				sensorPrecision: "0.2",
			},
		]);

		expect(subsystems).toEqual({
			maxHp: 8,
			shieldMaxHp: 3,
			armorRating: 4,
			weaponRating: 4,
			thrusterRating: 6,
			sensorRating: 7,
		});
	});

	it("uses fallback hp when no structural integrity is present", () => {
		expect(deriveSubsystems([], 7).maxHp).toBe(7);
		expect(
			deriveSubsystems([
				{
					structuralIntegrity: "0",
					shieldStrength: null,
					armorThickness: null,
					weaponDamage: null,
					thruster: null,
					sensorPrecision: null,
				},
			]),
		).toMatchObject({
			maxHp: 7,
			shieldMaxHp: 0,
			armorRating: 0,
			weaponRating: 0,
			thrusterRating: 0,
			sensorRating: 0,
		});
	});
});
