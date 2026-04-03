import { describe, expect, it, vi } from "vitest";
import { tickIndustrialProjects } from "../tick/industrialProjects.ts";

describe("tickIndustrialProjects", () => {
	it("applies duplicate upkeep before allocating work", async () => {
		const where = vi
			.fn()
			.mockResolvedValueOnce([
				{
					id: "project-1",
					gameId: "game-1",
					starSystemId: "ss-1",
					projectType: "factory_expansion",
					industryPerTurn: 3,
					workRequired: 12,
					workDone: 0,
					completionIndustryBonus: 2,
					maintenanceCost: 1,
					queuePosition: 1,
					startedAtTurn: null,
					completedAtTurn: null,
					playerId: "player-1",
				},
				{
					id: "built-1",
					gameId: "game-1",
					starSystemId: "ss-1",
					projectType: "factory_expansion",
					industryPerTurn: 3,
					workRequired: 12,
					workDone: 12,
					completionIndustryBonus: 2,
					maintenanceCost: 1,
					queuePosition: 1,
					startedAtTurn: 1,
					completedAtTurn: 2,
					playerId: "player-1",
				},
				{
					id: "built-2",
					gameId: "game-1",
					starSystemId: "ss-1",
					projectType: "factory_expansion",
					industryPerTurn: 3,
					workRequired: 12,
					workDone: 12,
					completionIndustryBonus: 2,
					maintenanceCost: 1,
					queuePosition: 2,
					startedAtTurn: 1,
					completedAtTurn: 2,
					playerId: "player-1",
				},
			])
			.mockResolvedValueOnce([
				{ id: "ss-1", industry: 10, ownerId: "player-1" },
			])
			.mockResolvedValueOnce([
				{ starSystemId: "ss-1", amount: 10_000_000_000n },
			]);

		const select = vi
			.fn()
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({ where }),
			})
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({ where }),
			})
			.mockReturnValueOnce({
				from: vi
					.fn()
					.mockResolvedValue([
						{ starSystemId: "ss-1", amount: 10_000_000_000n },
					]),
			});

		const tx = {
			select,
			update: vi.fn().mockReturnValue({
				set: vi
					.fn()
					.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
			}),
		};

		const industryChanges: unknown[] = [];
		const postMessage = vi.fn();

		await tickIndustrialProjects(tx as never, {
			turn: 3,
			postMessage,
			addMiningChange: vi.fn(),
			addPopulationChange: vi.fn(),
			addIndustryChange: (change) => industryChanges.push(change),
			getIndustryUtilized: () => 0,
			addIndustrialProjectCompletion: vi.fn(),
		});

		expect(postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "starSystem:industrialProjectProgress",
				workDone: 3,
			}),
		);
		expect(industryChanges).toContainEqual({
			starSystemId: "ss-1",
			industryTotal: 10,
			industryUtilized: 5,
		});
	});

	it("reports population-capped industry totals after a completion", async () => {
		const where = vi
			.fn()
			.mockResolvedValueOnce([
				{
					id: "project-1",
					gameId: "game-1",
					starSystemId: "ss-1",
					projectType: "factory_expansion",
					industryPerTurn: 3,
					workRequired: 12,
					workDone: 11,
					completionIndustryBonus: 2,
					maintenanceCost: 1,
					queuePosition: 1,
					startedAtTurn: 1,
					completedAtTurn: null,
					playerId: "player-1",
				},
			])
			.mockResolvedValueOnce([
				{ id: "ss-1", industry: 12, ownerId: "player-1" },
			])
			.mockResolvedValueOnce([
				{ starSystemId: "ss-1", amount: 10_000_000_000n },
			]);

		const select = vi
			.fn()
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({ where }),
			})
			.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({ where }),
			})
			.mockReturnValueOnce({
				from: vi
					.fn()
					.mockResolvedValue([
						{ starSystemId: "ss-1", amount: 10_000_000_000n },
					]),
			});

		const tx = {
			select,
			update: vi.fn().mockReturnValue({
				set: vi
					.fn()
					.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
			}),
		};

		const industryChanges: unknown[] = [];

		await tickIndustrialProjects(tx as never, {
			turn: 3,
			postMessage: vi.fn(),
			addMiningChange: vi.fn(),
			addPopulationChange: vi.fn(),
			addIndustryChange: (change) => industryChanges.push(change),
			getIndustryUtilized: () => 0,
			addIndustrialProjectCompletion: vi.fn(),
		});

		expect(industryChanges).toContainEqual({
			starSystemId: "ss-1",
			industryTotal: 13,
			industryUtilized: 1,
		});
	});
});
