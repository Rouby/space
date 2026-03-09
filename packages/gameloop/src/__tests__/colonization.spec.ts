import { describe, expect, it, vi } from "vitest";
import { tickColonization } from "../tick/colonization.ts";

describe("tickColonization", () => {
	it("emits progress while colonization is still in progress", async () => {
		const events: Array<{ type: string; id: string; turnsRemaining: number }> =
			[];
		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							starSystemId: "ss-1",
							dueTurn: 8,
						},
					]),
				}),
			}),
			update: vi.fn(),
			delete: vi.fn(),
		};

		await tickColonization(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 5,
			postMessage: (event) => events.push(event as never),
		});

		expect(events).toEqual([
			{
				type: "starSystem:colonizationProgress",
				id: "ss-1",
				turnsRemaining: 2,
			},
		]);
	});

	it("changes owner and emits owner change event when due turn is reached", async () => {
		const events: Array<{ type: string; id: string; ownerId: string }> = [];
		const deleteWhere = vi.fn().mockResolvedValue(undefined);
		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							starSystemId: "ss-1",
							playerId: "player-1",
							dueTurn: 6,
						},
					]),
				}),
			}),
			update: vi.fn().mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						returning: vi
							.fn()
							.mockResolvedValue([{ id: "ss-1", ownerId: "player-1" }]),
					}),
				}),
			}),
			delete: vi.fn().mockReturnValue({ where: deleteWhere }),
		};

		await tickColonization(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 5,
			postMessage: (event) => events.push(event as never),
		});

		expect(deleteWhere).toHaveBeenCalledTimes(1);
		expect(events).toEqual([
			{ type: "starSystem:ownerChanged", id: "ss-1", ownerId: "player-1" },
		]);
	});
});
