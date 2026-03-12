import { describe, expect, it, vi } from "vitest";
import type { GameEvent } from "../../../backend/src/events.ts";
import { tickColonization } from "../tick/colonization.ts";

describe("tickColonization", () => {
	it("does nothing if there are no source systems with > 1B population", async () => {
		const selectGovernances = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const selectChain1 = {
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						groupBy: vi.fn().mockResolvedValue([
							{
								id: "sys-source",
								ownerId: "player-1",
								position: { x: 0, y: 0 },
								totalPopulation: 500_000_000, // < 1 Billion
							},
						]),
					}),
				}),
			}),
		};

		const selectPressures = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const selectTargets = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const tx = {
			select: vi
				.fn()
				.mockReturnValueOnce(selectGovernances)
				.mockReturnValueOnce(selectChain1)
				.mockReturnValueOnce(selectTargets)
				.mockReturnValueOnce(selectPressures),
			update: vi.fn(),
			delete: vi.fn(),
			insert: vi.fn(),
		};

		await tickColonization(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 5,
			postMessage: vi.fn(),
		});

		// Insert/Update/Delete should not have been called because pressure is not built
		expect(tx.insert).not.toHaveBeenCalled();
		expect(tx.update).not.toHaveBeenCalled();
		expect(tx.delete).not.toHaveBeenCalled();
	});

	it("calculates pressure and emits progress when threshold is not met", async () => {
		const selectGovernances = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const selectPopulated = {
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						groupBy: vi.fn().mockResolvedValue([
							{
								id: "sys-source",
								ownerId: "player-1",
								position: { x: 0, y: 0 },
								totalPopulation: 2_000_000_000, // 2 Billion -> 2 pressure
							},
						]),
					}),
				}),
			}),
		};

		const selectTargets = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						id: "sys-target",
						position: { x: 10, y: 0 },
						discoverySlots: 0,
					},
				]),
			}),
		};

		const selectPressures = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						starSystemId: "sys-target",
						ownerId: "player-1",
						accumulatedPressure: "5", // Already has 5 pressure
						pressurePerTurn: "2",
					},
				]),
			}),
		};

		// Mock the sequence of tx.select() calls
		const tx = {
			select: vi
				.fn()
				.mockReturnValueOnce(selectGovernances)
				.mockReturnValueOnce(selectPopulated)
				.mockReturnValueOnce(selectTargets)
				.mockReturnValueOnce(selectPressures),
			insert: vi.fn().mockReturnValue({
				values: vi.fn().mockReturnValue({ onConflictDoUpdate: vi.fn() }),
			}),
			update: vi.fn(),
			delete: vi.fn(),
		};

		const events: GameEvent[] = [];
		const ctx = {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			addColonizationPressureChange: vi.fn(),
			turn: 5,
			postMessage: (event: GameEvent) => events.push(event),
		};

		await tickColonization(tx as never, ctx);

		expect(tx.insert).toHaveBeenCalled();
		expect(ctx.addColonizationPressureChange).toHaveBeenCalled();
		expect(events).toEqual([
			{
				type: "starSystem:colonizationProgress",
				id: "sys-target",
				turnsRemaining: expect.any(Number),
			},
		]);
	});

	it("changes owner when threshold is met", async () => {
		const selectGovernances = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const selectPopulated = {
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						groupBy: vi.fn().mockResolvedValue([
							{
								id: "sys-source",
								ownerId: "player-1",
								position: { x: 0, y: 0 },
								totalPopulation: 2_000_000_000, // 2 Billion -> 2 pressure outflow
							},
						]),
					}),
				}),
			}),
		};

		const selectTargets = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						id: "sys-target",
						position: { x: 10, y: 0 }, // Distance 10 -> Threshold is ~10 + 10/50 = 10.2
						discoverySlots: 0,
					},
				]),
			}),
		};

		const selectPressures = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						starSystemId: "sys-target",
						ownerId: "player-1",
						accumulatedPressure: "9.5", // Existing: 9.5 + 2 = 11.5 > 10.2 (threshold met)
						pressurePerTurn: "2",
					},
				]),
			}),
		};

		const updateReturning = vi
			.fn()
			.mockResolvedValue([{ id: "sys-target", ownerId: "player-1" }]);
		const updateWhere = vi.fn().mockReturnValue({ returning: updateReturning });
		const updateSet = vi.fn().mockReturnValue({ where: updateWhere });

		const tx = {
			select: vi
				.fn()
				.mockReturnValueOnce(selectGovernances)
				.mockReturnValueOnce(selectPopulated)
				.mockReturnValueOnce(selectTargets)
				.mockReturnValueOnce(selectPressures),
			update: vi.fn().mockReturnValue({ set: updateSet }),
			delete: vi.fn().mockReturnValue({ where: vi.fn() }),
			insert: vi.fn().mockReturnValue({ values: vi.fn() }),
		};

		const events: GameEvent[] = [];
		const ctx = {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			addColonizationCompleted: vi.fn(),
			turn: 6,
			postMessage: (event: GameEvent) => events.push(event),
		};

		await tickColonization(tx as never, ctx);

		expect(tx.update).toHaveBeenCalled();
		expect(tx.delete).toHaveBeenCalled();
		expect(tx.insert).toHaveBeenCalled();
		expect(ctx.addColonizationCompleted).toHaveBeenCalled();
		expect(events).toEqual([
			{
				type: "starSystem:ownerChanged",
				id: "sys-target",
				ownerId: "player-1",
			},
		]);
	});

	it("does not apply pressure to forbidden systems", async () => {
		const selectGovernances = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						gameId: "game-1",
						ownerId: "player-1",
						starSystemId: "sys-forbidden",
						governance: "forbid",
					},
				]),
			}),
		};

		const selectPopulated = {
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						groupBy: vi.fn().mockResolvedValue([
							{
								id: "sys-source",
								ownerId: "player-1",
								position: { x: 0, y: 0 },
								totalPopulation: 2_000_000_000,
							},
						]),
					}),
				}),
			}),
		};

		const selectTargets = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						id: "sys-forbidden",
						position: { x: 10, y: 0 },
						discoverySlots: 0,
					},
				]),
			}),
		};

		const tx = {
			select: vi
				.fn()
				.mockReturnValueOnce(selectGovernances)
				.mockReturnValueOnce(selectPopulated)
				.mockReturnValueOnce(selectTargets),
			insert: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		};

		await tickColonization(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 5,
			postMessage: vi.fn(),
		});

		expect(tx.insert).not.toHaveBeenCalled();
		expect(tx.update).not.toHaveBeenCalled();
		expect(tx.delete).not.toHaveBeenCalled();
	});

	it("prioritizes focused systems over non-focused systems", async () => {
		const selectGovernances = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						gameId: "game-1",
						ownerId: "player-1",
						starSystemId: "sys-focused",
						governance: "focus",
					},
				]),
			}),
		};

		const selectPopulated = {
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						groupBy: vi.fn().mockResolvedValue([
							{
								id: "sys-source",
								ownerId: "player-1",
								position: { x: 0, y: 0 },
								totalPopulation: 6_000_000_000,
							},
						]),
					}),
				}),
			}),
		};

		const selectTargets = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([
					{
						id: "sys-focused",
						position: { x: 10, y: 0 },
						discoverySlots: 0,
					},
					{
						id: "sys-normal",
						position: { x: 10, y: 0 },
						discoverySlots: 0,
					},
				]),
			}),
		};

		const selectPressures = {
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([]),
			}),
		};

		const onConflictDoUpdate = vi.fn();
		const values = vi.fn().mockReturnValue({ onConflictDoUpdate });

		const tx = {
			select: vi
				.fn()
				.mockReturnValueOnce(selectGovernances)
				.mockReturnValueOnce(selectPopulated)
				.mockReturnValueOnce(selectTargets)
				.mockReturnValueOnce(selectPressures),
			insert: vi.fn().mockReturnValue({ values }),
			update: vi.fn(),
			delete: vi.fn(),
		};

		const pressureChanges: Array<{
			starSystemId: string;
			pressureAdded: string;
		}> = [];

		await tickColonization(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			addColonizationPressureChange: (change) => pressureChanges.push(change),
			turn: 5,
			postMessage: vi.fn(),
		});

		expect(pressureChanges).toHaveLength(2);

		const focusedPressure = Number(
			pressureChanges.find((change) => change.starSystemId === "sys-focused")
				?.pressureAdded,
		);
		const normalPressure = Number(
			pressureChanges.find((change) => change.starSystemId === "sys-normal")
				?.pressureAdded,
		);

		expect(focusedPressure).toBeGreaterThan(normalPressure);
		expect(focusedPressure / normalPressure).toBeCloseTo(5, 5);
	});
});
