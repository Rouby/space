import { describe, expect, it, vi } from "vitest";
import { tickTaskForceCombat } from "../tick/taskForceCombat.ts";

const VALID_DECK_A = [
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
] as const;

const VALID_DECK_B = [
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
] as const;

type MockTaskForce = {
	id: string;
	ownerId: string;
	position: { x: number; y: number };
	movementVector: { x: number; y: number } | null;
	combatDeck: string[];
};

function createTx() {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const insertReturning = vi.fn().mockResolvedValue([{ id: "eng-1" }]);
	const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
	const insert = vi.fn().mockReturnValue({ values: insertValues });
	const updateWhere = vi.fn().mockResolvedValue([]);
	const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
	const update = vi.fn().mockReturnValue({ set: updateSet });
	const where = vi.fn().mockResolvedValue([
		{
			id: "tf-1",
			ownerId: "owner-a",
			position: { x: 0, y: 0 },
			movementVector: { x: 0, y: 0 },
			combatDeck: [...VALID_DECK_A],
		},
		{
			id: "tf-2",
			ownerId: "owner-b",
			position: { x: 0, y: 0 },
			movementVector: { x: 0, y: 0 },
			combatDeck: [...VALID_DECK_B],
		},
	]);
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		tx: {
			select,
			delete: del,
			insert,
			update,
		},
		deleteWhere,
		insertValues,
		insertReturning,
		updateWhere,
	};
}

function createTxWithTaskForces(mockTaskForces: MockTaskForce[]) {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const insertReturning = vi.fn().mockResolvedValue([{ id: "eng-1" }]);
	const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
	const insert = vi.fn().mockReturnValue({ values: insertValues });
	const updateWhere = vi.fn().mockResolvedValue([]);
	const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
	const update = vi.fn().mockReturnValue({ set: updateSet });
	const where = vi.fn().mockResolvedValue(mockTaskForces);
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		tx: {
			select,
			delete: del,
			insert,
			update,
		},
		insertValues,
		insertReturning,
	};
}

function createTxWithDecks(leftDeck: string[], rightDeck: string[]) {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const insertReturning = vi.fn().mockResolvedValue([{ id: "eng-1" }]);
	const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
	const insert = vi.fn().mockReturnValue({ values: insertValues });
	const updateWhere = vi.fn().mockResolvedValue([]);
	const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
	const update = vi.fn().mockReturnValue({ set: updateSet });
	const where = vi.fn().mockResolvedValue([
		{
			id: "tf-1",
			ownerId: "owner-a",
			position: { x: 0, y: 0 },
			movementVector: { x: 0, y: 0 },
			combatDeck: leftDeck,
		},
		{
			id: "tf-2",
			ownerId: "owner-b",
			position: { x: 0, y: 0 },
			movementVector: { x: 0, y: 0 },
			combatDeck: rightDeck,
		},
	]);
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		tx: {
			select,
			delete: del,
			insert,
			update,
		},
		deleteWhere,
		insertValues,
		insertReturning,
		updateWhere,
	};
}

describe("tickTaskForceCombat", () => {
	it("emits deterministic engagement start events without in-tick card resolution", async () => {
		const { tx } = createTx();
		const events: Array<{
			type: string;
			id?: string;
			weaponComponentId?: string;
		}> = [];

		await tickTaskForceCombat(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 4,
			postMessage: (event: unknown) => events.push(event as never),
		});

		const started = events.filter(
			(event) => event.type === "taskForceEngagement:started",
		);
		expect(started).toHaveLength(1);

		const fired = events.filter(
			(event) => event.type === "taskForceEngagement:weaponFired",
		);
		expect(fired).toHaveLength(0);
	});

	it("produces equivalent event streams for equivalent inputs", async () => {
		const runOnce = async () => {
			const { tx } = createTx();
			const events: unknown[] = [];
			await tickTaskForceCombat(tx as never, {
				addIndustryChange() {},
				addMiningChange() {},
				addPopulationChange() {},
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
				addIndustryChange() {},
				addMiningChange() {},
				addPopulationChange() {},
				turn: 4,
				postMessage: vi.fn(),
			}),
		).rejects.toMatchObject({ code: "COMBAT_STATE_INVALID" });
	});

	it("creates an engagement when opposing paths cross", async () => {
		const { tx, insertValues } = createTxWithTaskForces([
			{
				id: "tf-1",
				ownerId: "owner-a",
				position: { x: 10, y: 0 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_A],
			},
			{
				id: "tf-2",
				ownerId: "owner-b",
				position: { x: 5, y: 5 },
				movementVector: { x: 0, y: 10 },
				combatDeck: [...VALID_DECK_B],
			},
		]);
		const events: Array<{ type: string }> = [];

		await tickTaskForceCombat(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 8,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(
			events.filter((event) => event.type === "taskForceEngagement:started"),
		).toHaveLength(1);
		expect(insertValues).toHaveBeenCalledTimes(1);
	});

	it("creates an engagement when two task forces swap positions in one tick", async () => {
		const { tx } = createTxWithTaskForces([
			{
				id: "tf-1",
				ownerId: "owner-a",
				position: { x: 10, y: 0 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_A],
			},
			{
				id: "tf-2",
				ownerId: "owner-b",
				position: { x: 0, y: 0 },
				movementVector: { x: -10, y: 0 },
				combatDeck: [...VALID_DECK_B],
			},
		]);
		const events: Array<{ type: string }> = [];

		await tickTaskForceCombat(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 9,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(
			events.filter((event) => event.type === "taskForceEngagement:started"),
		).toHaveLength(1);
	});

	it("uses near-miss radius 25 to create or skip engagements deterministically", async () => {
		const insideRadius = createTxWithTaskForces([
			{
				id: "tf-1",
				ownerId: "owner-a",
				position: { x: 10, y: 0 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_A],
			},
			{
				id: "tf-2",
				ownerId: "owner-b",
				position: { x: 10, y: 20 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_B],
			},
		]);
		const insideEvents: Array<{ type: string }> = [];
		await tickTaskForceCombat(insideRadius.tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 10,
			postMessage: (event: unknown) => insideEvents.push(event as never),
		});

		const outsideRadius = createTxWithTaskForces([
			{
				id: "tf-1",
				ownerId: "owner-a",
				position: { x: 10, y: 0 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_A],
			},
			{
				id: "tf-2",
				ownerId: "owner-b",
				position: { x: 10, y: 30 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_B],
			},
		]);
		const outsideEvents: Array<{ type: string }> = [];
		await tickTaskForceCombat(outsideRadius.tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 10,
			postMessage: (event: unknown) => outsideEvents.push(event as never),
		});

		expect(
			insideEvents.filter(
				(event) => event.type === "taskForceEngagement:started",
			),
		).toHaveLength(1);
		expect(
			outsideEvents.filter(
				(event) => event.type === "taskForceEngagement:started",
			),
		).toHaveLength(0);
	});

	it("creates one deterministic 1v1 engagement per task force when multiple opponents contest", async () => {
		const { tx } = createTxWithTaskForces([
			{
				id: "tf-1",
				ownerId: "owner-a",
				position: { x: 10, y: 0 },
				movementVector: { x: 10, y: 0 },
				combatDeck: [...VALID_DECK_A],
			},
			{
				id: "tf-2",
				ownerId: "owner-b",
				position: { x: 5, y: 5 },
				movementVector: { x: 0, y: 10 },
				combatDeck: [...VALID_DECK_B],
			},
			{
				id: "tf-3",
				ownerId: "owner-b",
				position: { x: 6, y: 5 },
				movementVector: { x: 0, y: 10 },
				combatDeck: [...VALID_DECK_B],
			},
		]);
		const starts: Array<{ taskForceIdA: string; taskForceIdB: string }> = [];

		await tickTaskForceCombat(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 11,
			postMessage: (event: unknown) => {
				const candidate = event as {
					type: string;
					taskForceIdA: string;
					taskForceIdB: string;
				};
				if (candidate.type === "taskForceEngagement:started") {
					starts.push({
						taskForceIdA: candidate.taskForceIdA,
						taskForceIdB: candidate.taskForceIdB,
					});
				}
			},
		});

		expect(starts).toEqual([{ taskForceIdA: "tf-1", taskForceIdB: "tf-2" }]);
	});
});
