import { describe, expect, it, vi } from "vitest";
import { tickTaskForceCombat } from "../tick/taskForceCombat.ts";

function createTx() {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const where = vi.fn().mockResolvedValue([
		{
			id: "tf-1",
			position: { x: 0, y: 0 },
			combatDeck: [
				"target_lock",
				"emergency_repairs",
				"laser_burst",
				"shield_pulse",
				"evasive_maneuver",
				"overcharge_barrage",
				"laser_burst",
				"target_lock",
				"emergency_repairs",
				"shield_pulse",
				"evasive_maneuver",
				"overcharge_barrage",
			],
		},
		{
			id: "tf-2",
			position: { x: 0, y: 0 },
			combatDeck: [
				"shield_pulse",
				"emergency_repairs",
				"laser_burst",
				"target_lock",
				"evasive_maneuver",
				"overcharge_barrage",
				"shield_pulse",
				"emergency_repairs",
				"laser_burst",
				"target_lock",
				"evasive_maneuver",
				"overcharge_barrage",
			],
		},
	]);
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		tx: {
			select,
			delete: del,
		},
		deleteWhere,
	};
}

function createTxWithDecks(leftDeck: string[], rightDeck: string[]) {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const where = vi.fn().mockResolvedValue([
		{
			id: "tf-1",
			position: { x: 0, y: 0 },
			combatDeck: leftDeck,
		},
		{
			id: "tf-2",
			position: { x: 0, y: 0 },
			combatDeck: rightDeck,
		},
	]);
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		tx: {
			select,
			delete: del,
		},
		deleteWhere,
	};
}

describe("tickTaskForceCombat", () => {
	it("emits deterministic card combat lifecycle and per-round card effects", async () => {
		const { tx } = createTx();
		const events: Array<{
			type: string;
			id?: string;
			weaponComponentId?: string;
		}> = [];

		await tickTaskForceCombat(tx as never, {
			turn: 4,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(events[0]?.type).toBe("taskForceEngagement:started");
		expect(events.at(-1)?.type).toBe("taskForceEngagement:ended");

		const fired = events.filter(
			(event) => event.type === "taskForceEngagement:weaponFired",
		);
		expect(fired).toHaveLength(6);
		expect(fired.map((event) => event.weaponComponentId)).toEqual([
			"target_lock",
			"shield_pulse",
			"emergency_repairs",
			"emergency_repairs",
			"laser_burst",
			"laser_burst",
		]);
	});

	it("produces equivalent event streams for equivalent inputs", async () => {
		const runOnce = async () => {
			const { tx } = createTx();
			const events: unknown[] = [];
			await tickTaskForceCombat(tx as never, {
				turn: 4,
				postMessage: (event: unknown) => events.push(event),
			});
			return events;
		};

		const first = await runOnce();
		const second = await runOnce();

		expect(second).toEqual(first);
	});

	it("fails fast with COMBAT_STATE_INVALID when a persisted deck is invalid", async () => {
		const { tx } = createTxWithDecks(
			["laser_burst"],
			[
				"shield_pulse",
				"emergency_repairs",
				"laser_burst",
				"target_lock",
				"evasive_maneuver",
				"overcharge_barrage",
				"shield_pulse",
				"emergency_repairs",
				"laser_burst",
				"target_lock",
				"evasive_maneuver",
				"overcharge_barrage",
			],
		);

		await expect(
			tickTaskForceCombat(tx as never, {
				turn: 4,
				postMessage: vi.fn(),
			}),
		).rejects.toMatchObject({ code: "COMBAT_STATE_INVALID" });
	});
});
