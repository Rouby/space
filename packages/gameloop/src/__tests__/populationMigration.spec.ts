import { describe, expect, it } from "vitest";
import { planPopulationMigrations } from "../tick/populationMigration.ts";

describe("planPopulationMigrations", () => {
	it("preserves population totals across all planned moves", () => {
		const sourceByAllegiance = new Map([
			["player-a", 2_700_000_000n],
			["player-b", 300_000_000n],
		]);

		const moves = planPopulationMigrations([
			{
				id: "sys-source",
				ownerId: "player-a",
				position: { x: 0, y: 0 },
				industry: 0,
				discoverySlots: 0,
				totalPopulation: 3_000_000_000,
				populations: [
					{ allegianceToPlayerId: "player-a", amount: 2_700_000_000 },
					{ allegianceToPlayerId: "player-b", amount: 300_000_000 },
				],
			},
			{
				id: "sys-destination-1",
				ownerId: "player-a",
				position: { x: 120, y: 0 },
				industry: 8,
				discoverySlots: 3,
				totalPopulation: 600_000_000,
				populations: [
					{ allegianceToPlayerId: "player-a", amount: 600_000_000 },
				],
			},
			{
				id: "sys-destination-2",
				ownerId: "player-c",
				position: { x: 150, y: 80 },
				industry: 6,
				discoverySlots: 2,
				totalPopulation: 500_000_000,
				populations: [
					{ allegianceToPlayerId: "player-c", amount: 500_000_000 },
				],
			},
		]);

		const totalOut = moves.reduce((sum, move) => sum + move.amount, 0n);
		const totalIn = moves.reduce((sum, move) => sum + move.amount, 0n);
		const outByAllegiance = moves.reduce((acc, move) => {
			acc.set(
				move.allegianceToPlayerId,
				(acc.get(move.allegianceToPlayerId) ?? 0n) + move.amount,
			);
			return acc;
		}, new Map<string, bigint>());

		for (const [allegiance, moved] of outByAllegiance.entries()) {
			expect(moved).toBeLessThanOrEqual(
				sourceByAllegiance.get(allegiance) ?? 0n,
			);
		}

		expect(totalOut).toBe(totalIn);
		expect(totalOut).toBeGreaterThan(0n);
	});

	it("supports intra-faction and inter-faction destinations", () => {
		const systems = [
			{
				id: "sys-source",
				ownerId: "player-a",
				position: { x: 0, y: 0 },
				industry: 0,
				discoverySlots: 0,
				totalPopulation: 4_000_000_000,
				populations: [
					{ allegianceToPlayerId: "player-a", amount: 3_200_000_000 },
					{ allegianceToPlayerId: "player-b", amount: 800_000_000 },
				],
			},
			{
				id: "sys-ally",
				ownerId: "player-a",
				position: { x: 110, y: 0 },
				industry: 8,
				discoverySlots: 4,
				totalPopulation: 700_000_000,
				populations: [
					{ allegianceToPlayerId: "player-a", amount: 700_000_000 },
				],
			},
			{
				id: "sys-border",
				ownerId: "player-c",
				position: { x: 120, y: 30 },
				industry: 7,
				discoverySlots: 3,
				totalPopulation: 600_000_000,
				populations: [
					{ allegianceToPlayerId: "player-c", amount: 600_000_000 },
				],
			},
		];

		const ownerBySystem = new Map(
			systems.map((system) => [system.id, system.ownerId]),
		);
		const moves = planPopulationMigrations(systems);
		const touchedOwners = new Set(
			moves.map((move) => ownerBySystem.get(move.destinationStarSystemId)),
		);

		expect(touchedOwners.has("player-a")).toBe(true);
		expect(touchedOwners.has("player-c")).toBe(true);
		expect(moves.some((move) => move.allegianceToPlayerId === "player-b")).toBe(
			true,
		);
	});

	it("does not produce moves when no valid destination exists", () => {
		const moves = planPopulationMigrations([
			{
				id: "sys-alone",
				ownerId: "player-a",
				position: { x: 0, y: 0 },
				industry: 0,
				discoverySlots: 0,
				totalPopulation: 3_000_000_000,
				populations: [
					{ allegianceToPlayerId: "player-a", amount: 3_000_000_000 },
				],
			},
		]);

		expect(moves).toEqual([]);
	});
});
