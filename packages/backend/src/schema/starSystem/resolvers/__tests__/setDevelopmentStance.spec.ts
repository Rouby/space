import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { setDevelopmentStance } from "../Mutation/setDevelopmentStance.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callSetDevelopmentStance = resolverFn(setDevelopmentStance);

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("setDevelopmentStance mutation", () => {
	it("rejects non-owner with NOT_AUTHORIZED", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							gameId: "game-1",
							ownerId: "user-2",
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
						}),
					},
				},
			},
		};

		await expect(
			callSetDevelopmentStance(
				{},
				{ starSystemId: "ss-1", stance: "industrialize" },
				ctx as never,
			),
		).rejects.toMatchObject(
			createGraphQLError(
				"Not authorized to set development stance for this star system",
				{
					extensions: { code: "NOT_AUTHORIZED" },
				},
			),
		);
	});

	it("upserts stance for current turn and returns star system", async () => {
		const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
		const values = vi.fn().mockReturnValue({ onConflictDoUpdate });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							gameId: "game-1",
							ownerId: "user-1",
							name: "Alpha",
							position: { x: 1, y: 2 },
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
						}),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 5,
							startedAt: new Date(),
						}),
					},
				},
				insert: vi.fn().mockReturnValue({ values }),
			},
		};

		const result = await callSetDevelopmentStance(
			{},
			{ starSystemId: "ss-1", stance: "grow_population" },
			ctx as never,
		);

		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: "game-1",
				starSystemId: "ss-1",
				playerId: "user-1",
				turnNumber: 5,
				stance: "grow_population",
			}),
		);
		expect(onConflictDoUpdate).toHaveBeenCalledTimes(1);
		expect(result).toMatchObject({ id: "ss-1", isVisible: true });
	});

	it("rejects when game is not started", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							gameId: "game-1",
							ownerId: "user-1",
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
						}),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 5,
							startedAt: null,
						}),
					},
				},
			},
		};

		await expect(
			callSetDevelopmentStance(
				{},
				{ starSystemId: "ss-1", stance: "balance" },
				ctx as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Game has not started yet", {
				extensions: { code: "GAME_NOT_STARTED" },
			}),
		);
	});
});
