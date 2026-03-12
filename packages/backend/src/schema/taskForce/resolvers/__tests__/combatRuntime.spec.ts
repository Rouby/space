import { describe, expect, it } from "vitest";
import { type CombatState, resolveCard } from "../combatRuntime.js";

function createState(
	taskForceId: string,
	overrides: Partial<CombatState> = {},
): CombatState {
	return {
		taskForceId,
		hp: 10,
		maxHp: 10,
		shieldHp: 0,
		shieldMaxHp: 0,
		armorRating: 0,
		weaponRating: 0,
		thrusterRating: 0,
		sensorRating: 0,
		hand: [],
		deck: [],
		discard: [],
		nextDamageBonus: 0,
		nextDamageReduction: 0,
		...overrides,
	};
}

describe("resolveCard subsystem interactions", () => {
	it("laser_burst applies shield then armor then reduction", () => {
		const attacker = createState("attacker", {
			weaponRating: 6,
			nextDamageBonus: 2,
		});
		const target = createState("target", {
			hp: 12,
			shieldHp: 3,
			armorRating: 2,
			nextDamageReduction: 1,
		});

		const entry = resolveCard({
			attacker,
			target,
			cardId: "laser_burst",
			round: 1,
		});

		expect(entry.shieldDamage).toBe(3);
		expect(entry.armorAbsorbed).toBe(2);
		expect(entry.hullDamage).toBe(2);
		expect(entry.resolvedValue).toBe(2);
		expect(target.hp).toBe(10);
		expect(target.shieldHp).toBe(0);
		expect(target.nextDamageReduction).toBe(0);
		expect(attacker.nextDamageBonus).toBe(0);
	});

	it("overcharge_barrage bypasses armor but not shields", () => {
		const attacker = createState("attacker", { weaponRating: 5 });
		const target = createState("target", {
			hp: 10,
			shieldHp: 1,
			armorRating: 99,
			nextDamageReduction: 1,
		});

		const entry = resolveCard({
			attacker,
			target,
			cardId: "overcharge_barrage",
			round: 1,
		});

		expect(entry.shieldDamage).toBe(1);
		expect(entry.armorAbsorbed).toBe(0);
		expect(entry.hullDamage).toBe(3);
		expect(target.hp).toBe(7);
	});

	it("target_lock and evasive_maneuver scale with sensor and thruster ratings", () => {
		const attacker = createState("attacker", {
			sensorRating: 4,
			thrusterRating: 3,
		});
		const target = createState("target");

		const lock = resolveCard({
			attacker,
			target,
			cardId: "target_lock",
			round: 2,
		});
		const evade = resolveCard({
			attacker,
			target,
			cardId: "evasive_maneuver",
			round: 2,
		});

		expect(lock.resolvedValue).toBe(4);
		expect(evade.resolvedValue).toBe(3);
		expect(attacker.nextDamageBonus).toBe(4);
		expect(attacker.nextDamageReduction).toBe(3);
	});

	it("same deck action yields different results across archetypes", () => {
		const attacker = createState("attacker", { weaponRating: 5 });
		const tankTarget = createState("tank", {
			hp: 12,
			shieldHp: 2,
			armorRating: 2,
		});
		const glassTarget = createState("glass", {
			hp: 12,
			shieldHp: 0,
			armorRating: 0,
		});

		const tankEntry = resolveCard({
			attacker: { ...attacker },
			target: tankTarget,
			cardId: "laser_burst",
			round: 1,
		});
		const glassEntry = resolveCard({
			attacker: { ...attacker },
			target: glassTarget,
			cardId: "laser_burst",
			round: 1,
		});

		expect(tankEntry.hullDamage).toBe(1);
		expect(glassEntry.hullDamage).toBe(5);
	});

	it("is deterministic for equivalent inputs", () => {
		const a1 = createState("a", { weaponRating: 4, nextDamageBonus: 1 });
		const t1 = createState("b", {
			hp: 9,
			shieldHp: 2,
			armorRating: 1,
			nextDamageReduction: 1,
		});

		const a2 = createState("a", { weaponRating: 4, nextDamageBonus: 1 });
		const t2 = createState("b", {
			hp: 9,
			shieldHp: 2,
			armorRating: 1,
			nextDamageReduction: 1,
		});

		const first = resolveCard({
			attacker: a1,
			target: t1,
			cardId: "laser_burst",
			round: 3,
		});
		const second = resolveCard({
			attacker: a2,
			target: t2,
			cardId: "laser_burst",
			round: 3,
		});

		expect(second).toEqual(first);
		expect(a2).toEqual(a1);
		expect(t2).toEqual(t1);
	});
});
