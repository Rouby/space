import { describe, expect, it, vi } from "vitest";
import { tickDevelopmentStances } from "../tick/developmentStance.ts";

describe("tickDevelopmentStances", () => {
	it("applies default balance stance when no explicit stance exists", async () => {
		const whereSelect = vi
			.fn()
			.mockResolvedValueOnce([{ id: "ss-1", industry: 10 }])
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([
				{
					allegianceToPlayerId: "player-1",
					amount: 1000n,
					growthLeftover: "0",
				},
			]);

		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({ where: whereSelect }),
			}),
			update: vi.fn().mockReturnValue({
				set: vi
					.fn()
					.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
			}),
		};

		const populationChanges: unknown[] = [];
		const industryChanges: unknown[] = [];

		await tickDevelopmentStances(tx as never, {
			turn: 5,
			postMessage: vi.fn(),
			addMiningChange: vi.fn(),
			addPopulationChange: (change) => populationChanges.push(change),
			addIndustryChange: (change) => industryChanges.push(change),
		});

		expect(industryChanges).toEqual([
			{
				starSystemId: "ss-1",
				industryTotal: 11,
				industryUtilized: 0,
			},
		]);
		expect(populationChanges).toHaveLength(0);
	});

	it("applies explicit grow_population stance and emits population growth changes", async () => {
		const whereSelect = vi
			.fn()
			.mockResolvedValueOnce([{ id: "ss-1", industry: 10 }])
			.mockResolvedValueOnce([
				{ starSystemId: "ss-1", stance: "grow_population" },
			])
			.mockResolvedValueOnce([
				{
					allegianceToPlayerId: "player-1",
					amount: 1000000n,
					growthLeftover: "0",
				},
			]);

		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({ where: whereSelect }),
			}),
			update: vi.fn().mockReturnValue({
				set: vi
					.fn()
					.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
			}),
		};

		const populationChanges: unknown[] = [];

		await tickDevelopmentStances(tx as never, {
			turn: 5,
			postMessage: vi.fn(),
			addMiningChange: vi.fn(),
			addPopulationChange: (change) => populationChanges.push(change),
			addIndustryChange: vi.fn(),
		});

		expect(populationChanges).toHaveLength(1);
		expect(populationChanges[0]).toMatchObject({
			starSystemId: "ss-1",
			growth: 1200n,
		});
	});
});
