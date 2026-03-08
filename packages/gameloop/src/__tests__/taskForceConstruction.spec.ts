import { describe, expect, it, vi } from "vitest";
import { tickTaskForceConstruction } from "../tick/taskForceConstruction.ts";

describe("tickTaskForceConstruction", () => {
	it("advances construction progress deterministically and emits progress event", async () => {
		const where = vi.fn().mockResolvedValue([
			{
				id: "tf-1",
				gameId: "game-1",
				constructionStarSystemId: "ss-1",
				constructionDone: "0",
				constructionTotal: "10",
				constructionPerTick: "5",
			},
		]);
		const from = vi.fn().mockReturnValue({ where });
		const select = vi.fn().mockReturnValue({ from });

		const whereUpdate = vi.fn().mockResolvedValue([]);
		const set = vi.fn().mockReturnValue({ where: whereUpdate });
		const update = vi.fn().mockReturnValue({ set });

		const tx = {
			select,
			update,
		};

		const events: Array<{ type: string; constructionDone: number }> = [];

		await tickTaskForceConstruction(tx as never, {
			turn: 1,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(set).toHaveBeenCalledWith({ constructionDone: "5" });
		expect(where).toHaveBeenCalledTimes(1);
		expect(events).toEqual([
			{
				type: "taskForceCommision:progress",
				id: "tf-1",
				starSystemId: "ss-1",
				constructionDone: 5,
				constructionTotal: 10,
				constructionPerTick: 5,
			},
		]);
	});
});
