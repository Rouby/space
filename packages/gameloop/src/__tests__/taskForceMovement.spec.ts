import { describe, expect, it, vi } from "vitest";
import { tickTaskForceMovement } from "../tick/taskForceMovement";

describe("tickTaskForceMovement", () => {
	it("moves task force to destination deterministically and emits position event", async () => {
		const movedTaskForce = {
			id: "tf-1",
			position: { x: 10, y: 20 },
			movementVector: { x: 10, y: 20 },
			orders: [],
		};

		const returning = vi.fn().mockResolvedValue([movedTaskForce]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });

		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							id: "tf-1",
							position: { x: 0, y: 0 },
							orders: [
								{
									id: "o-1",
									type: "move",
									destination: { x: 10, y: 20 },
								},
							],
						},
					]),
				}),
			}),
			update,
		};

		const events: Array<{
			type: string;
			id: string;
			position: { x: number; y: number };
			movementVector: { x: number; y: number } | null;
		}> = [];

		await tickTaskForceMovement(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 3,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(set).toHaveBeenCalledWith({
			position: { x: 10, y: 20 },
			movementVector: { x: 10, y: 20 },
			orders: [],
		});
		expect(events).toEqual([
			{
				type: "taskForce:position",
				id: "tf-1",
				position: { x: 10, y: 20 },
				movementVector: { x: 10, y: 20 },
			},
		]);
	});

	it("progresses long-distance move orders over multiple ticks", async () => {
		const returning = vi.fn().mockResolvedValue([
			{
				id: "tf-1",
				position: { x: 1000, y: 0 },
				movementVector: { x: 1000, y: 0 },
			},
		]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });

		const tx = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							id: "tf-1",
							position: { x: 0, y: 0 },
							orders: [
								{
									id: "o-1",
									type: "move",
									destination: { x: 2001, y: 0 },
								},
							],
						},
					]),
				}),
			}),
			update,
		};

		const events: Array<{ type: string }> = [];

		await tickTaskForceMovement(tx as never, {
			addIndustryChange() {},
			addMiningChange() {},
			addPopulationChange() {},
			turn: 3,
			postMessage: (event: unknown) => events.push(event as never),
		});

		expect(set).toHaveBeenCalledWith({
			position: { x: 1000, y: 0 },
			movementVector: { x: 1000, y: 0 },
			orders: [
				{
					id: "o-1",
					type: "move",
					destination: { x: 2001, y: 0 },
				},
			],
		});
		expect(events).toEqual([
			{
				type: "taskForce:position",
				id: "tf-1",
				position: { x: 1000, y: 0 },
				movementVector: { x: 1000, y: 0 },
			},
		]);
	});
});
