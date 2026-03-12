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

type MockComponentRow = {
	taskForceId: string;
	structuralIntegrity: string | null;
	shieldStrength: string | null;
	armorThickness: string | null;
	weaponDamage: string | null;
	thruster: string | null;
	sensorPrecision: string | null;
};

function createSelectChain(result: unknown[]) {
	const where = vi.fn().mockResolvedValue(result);
	const secondJoin = vi.fn().mockReturnValue({ where });
	const firstJoin = vi.fn().mockReturnValue({ innerJoin: secondJoin, where });
	const from = vi.fn().mockReturnValue({ where, innerJoin: firstJoin });
	return { from };
}

function createTxWithTaskForcesAndComponents(
	mockTaskForces: MockTaskForce[],
	componentRows: MockComponentRow[] = [],
) {
	const deleteWhere = vi.fn().mockResolvedValue([]);
	const del = vi.fn().mockReturnValue({ where: deleteWhere });
	const insertReturning = vi.fn().mockResolvedValue([{ id: "eng-1" }]);
	const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
	const insert = vi.fn().mockReturnValue({ values: insertValues });
	const updateWhere = vi.fn().mockResolvedValue([]);
	const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
	const update = vi.fn().mockReturnValue({ set: updateSet });

	const taskForceSelect = createSelectChain(mockTaskForces);
	const componentSelect = createSelectChain(componentRows);
	const select = vi
		.fn()
		.mockReturnValueOnce(taskForceSelect)
		.mockReturnValue(componentSelect);

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

function createTx() {
	return createTxWithTaskForcesAndComponents([
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
}

function createTxWithTaskForces(mockTaskForces: MockTaskForce[]) {
	return createTxWithTaskForcesAndComponents(mockTaskForces);
}

function createTxWithDecks(leftDeck: string[], rightDeck: string[]) {
	return createTxWithTaskForcesAndComponents([
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

	it("seeds subsystem combat state from component-derived archetypes", async () => {
		const { tx, insertValues } = createTxWithTaskForcesAndComponents(
			[
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
			],
			[
				{
					taskForceId: "tf-1",
					structuralIntegrity: "9",
					shieldStrength: "3",
					armorThickness: "4",
					weaponDamage: "5",
					thruster: "1",
					sensorPrecision: "2",
				},
				{
					taskForceId: "tf-2",
					structuralIntegrity: "6",
					shieldStrength: "0",
					armorThickness: "1",
					weaponDamage: "2",
					thruster: "4",
					sensorPrecision: "5",
				},
			],
		);

		await tickTaskForceCombat(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 12,
			postMessage: vi.fn(),
		});

		expect(insertValues).toHaveBeenCalledTimes(1);
		const [engagementSeed] = insertValues.mock.calls[0] as [
			{
				stateA: {
					hp: number;
					maxHp: number;
					shieldHp: number;
					armorRating: number;
					weaponRating: number;
				};
				stateB: {
					hp: number;
					maxHp: number;
					shieldHp: number;
					armorRating: number;
					weaponRating: number;
				};
			},
		];

		expect(engagementSeed.stateA.maxHp).toBe(9);
		expect(engagementSeed.stateA.hp).toBe(9);
		expect(engagementSeed.stateA.shieldHp).toBe(3);
		expect(engagementSeed.stateA.armorRating).toBe(4);
		expect(engagementSeed.stateA.weaponRating).toBe(5);

		expect(engagementSeed.stateB.maxHp).toBe(6);
		expect(engagementSeed.stateB.hp).toBe(6);
		expect(engagementSeed.stateB.shieldHp).toBe(0);
		expect(engagementSeed.stateB.armorRating).toBe(1);
		expect(engagementSeed.stateB.weaponRating).toBe(2);
	});
});
