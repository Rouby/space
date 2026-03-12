import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { trackStarSystem } from "../../../base/resolvers/Subscription/trackStarSystem.ts";
import { orderTaskForce } from "../../../taskForce/resolvers/Mutation/orderTaskForce.ts";
import { game } from "../Query/game.ts";
import { games } from "../Query/games.ts";
import { trackGame } from "../Subscription/trackGame.ts";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

const callGames = resolverFn(games);
const callGame = resolverFn(game);
const callOrderTaskForce = resolverFn(orderTaskForce);
const trackGameSubscribe =
	typeof trackGame === "function" ? trackGame : trackGame.subscribe;
const trackGameResolve =
	typeof trackGame === "function" ? undefined : trackGame.resolve;
const trackStarSystemSubscribe =
	typeof trackStarSystem === "function"
		? trackStarSystem
		: trackStarSystem.subscribe;

describe("story 1.2 authorization boundaries", () => {
	it("returns only games the current player belongs to", async () => {
		const findManyPlayers = vi.fn().mockResolvedValue([{ gameId: "game-1" }]);
		const findManyGames = vi.fn().mockResolvedValue([{ id: "game-1" }]);

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					players: { findMany: findManyPlayers },
					games: { findMany: findManyGames },
				},
			},
		};

		const result = await callGames({}, {}, ctx as never, {} as never);

		expect(result).toEqual([{ id: "game-1" }]);
		expect(ctx.throwWithoutClaim).toHaveBeenCalledWith("urn:space:claim");
		expect(findManyPlayers).toHaveBeenCalledTimes(1);
		expect(findManyGames).toHaveBeenCalledTimes(1);
	});

	it("rejects game lookup for non-members with NOT_AUTHORIZED", async () => {
		const ctx = {
			userId: "user-2",
			throwWithoutClaim: vi.fn(),
			denyAccess,
			drizzle: {
				query: {
					players: { findFirst: vi.fn().mockResolvedValue(null) },
					games: { findFirst: vi.fn() },
				},
			},
		};

		await expect(
			callGame({}, { id: "game-1" }, ctx as never, {} as never),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to access this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("rejects task-force orders when caller does not own the task force", async () => {
		const ctx = {
			userId: "user-3",
			throwWithoutClaim: vi.fn(),
			denyAccess,
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
			},
		};

		await expect(
			callOrderTaskForce(
				{},
				{
					id: "task-force-1",
					queue: false,
					orders: [{ move: { destination: { x: 10, y: 10 } } }],
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Task force not found", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("rejects game subscription when caller is not a game player", async () => {
		const ctx = {
			userId: "user-4",
			throwWithoutClaim: vi.fn(),
			denyAccess,
			drizzle: {
				query: {
					players: { findFirst: vi.fn().mockResolvedValue(null) },
				},
			},
		};

		await expect(
			trackGameSubscribe?.({}, { gameId: "game-2" }, ctx as never, {} as never),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to track this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("rejects unknown trackGame events with INVALID_GAME_EVENT", async () => {
		const ctx = {
			userId: "user-6",
			throwWithoutClaim: vi.fn(),
			denyAccess,
			drizzle: {
				query: {
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-6",
						}),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 3,
						}),
					},
				},
			},
		};

		await expect(
			trackGameResolve?.(
				{ type: "game:unknown", gameId: "game-1" } as never,
				{} as never,
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Unsupported game event received", {
				extensions: { code: "INVALID_GAME_EVENT" },
			}),
		);
	});

	it("rejects star-system subscription for member without current vision", async () => {
		const where = vi
			.fn()
			.mockResolvedValue([
				{ id: "ss-1", gameId: "game-1", position: { x: 100, y: 100 } },
			]);
		const from = vi.fn().mockReturnValue({ where });
		const select = vi.fn().mockReturnValue({ from });

		const ctx = {
			userId: "user-5",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(false),
			denyAccess,
			drizzle: {
				select,
				query: {
					players: {
						findFirst: vi.fn().mockResolvedValue({
							id: "player-1",
							gameId: "game-1",
							userId: "user-5",
						}),
					},
				},
			},
		};

		await expect(
			trackStarSystemSubscribe?.(
				{},
				{ starSystemId: "ss-1" },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to track this star system", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});
});
