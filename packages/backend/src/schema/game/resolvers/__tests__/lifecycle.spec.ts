import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { createGame } from "../Mutation/createGame.js";
import { joinGame } from "../Mutation/joinGame.js";
import { startGame } from "../Mutation/startGame.js";
import { updateGameSettings } from "../Mutation/updateGameSettings.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callCreateGame = resolverFn(createGame);
const callJoinGame = resolverFn(joinGame);
const callStartGame = resolverFn(startGame);
const callUpdateGameSettings = resolverFn(updateGameSettings);

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("story 1.3 game lifecycle controls", () => {
	it("rejects out-of-range auto-turn values with INVALID_GAME_SETTINGS", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "user-1",
							autoEndTurnAfterHoursInactive: 0,
							autoEndTurnEveryHours: 0,
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({ userId: "user-1" }),
					},
				},
				update: vi.fn().mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockReturnValue({
							returning: vi.fn(),
						}),
					}),
				}),
			},
		};

		await expect(
			callUpdateGameSettings(
				{},
				{
					gameId: "game-1",
					input: {
						autoEndTurnAfterHoursInactive: 49,
						autoEndTurnEveryHours: 0,
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Auto-turn settings must be between 0 and 48 hours", {
				extensions: { code: "INVALID_GAME_SETTINGS" },
			}),
		);
	});

	it("rejects conflicting auto-turn modes with INVALID_GAME_SETTINGS", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "user-1",
							autoEndTurnAfterHoursInactive: 0,
							autoEndTurnEveryHours: 0,
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({ userId: "user-1" }),
					},
				},
				update: vi.fn().mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockReturnValue({
							returning: vi.fn(),
						}),
					}),
				}),
			},
		};

		await expect(
			callUpdateGameSettings(
				{},
				{
					gameId: "game-1",
					input: {
						autoEndTurnAfterHoursInactive: 4,
						autoEndTurnEveryHours: 8,
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError(
				"Choose either inactivity auto-end or periodic auto-end, not both",
				{
					extensions: { code: "INVALID_GAME_SETTINGS" },
				},
			),
		);
	});

	it("returns existing game on duplicate join attempts", async () => {
		const insertValues = vi.fn();
		const ctx = {
			userId: "user-2",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-2",
						}),
					},
				},
				insert: vi.fn().mockReturnValue({ values: insertValues }),
			},
		};

		const result = await callJoinGame(
			{},
			{ id: "game-1" },
			ctx as never,
			{} as never,
		);

		expect(result).toMatchObject({ id: "game-1" });
		expect(insertValues).not.toHaveBeenCalled();
	});

	it("treats duplicate-key join races as idempotent success", async () => {
		const duplicateError = { code: "23505" };
		const insertValues = vi.fn().mockRejectedValue(duplicateError);
		const ctx = {
			userId: "user-2",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
				insert: vi.fn().mockReturnValue({ values: insertValues }),
			},
		};

		const result = await callJoinGame(
			{},
			{ id: "game-1" },
			ctx as never,
			{} as never,
		);

		expect(result).toMatchObject({ id: "game-1" });
	});

	it("rejects starting a game for non-members with NOT_AUTHORIZED", async () => {
		const denyAccess = vi.fn(({ message, code }) => {
			throw createGraphQLError(message, { extensions: { code } });
		});
		const ctx = {
			userId: "intruder",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					players: { findFirst: vi.fn().mockResolvedValue(null) },
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "host-1",
							startedAt: null,
						}),
					},
				},
			},
		};

		await expect(
			callStartGame({}, { id: "game-1" }, ctx as never, {} as never),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to start this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
		expect(ctx.denyAccess).toHaveBeenCalledTimes(1);
	});

	it("rejects starting a game for non-host participants with NOT_AUTHORIZED", async () => {
		const ctx = {
			userId: "member-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "member-1",
						}),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "host-1",
							startedAt: null,
						}),
					},
				},
			},
		};

		await expect(
			callStartGame({}, { id: "game-1" }, ctx as never, {} as never),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to start this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("rejects settings updates for non-host participants with NOT_AUTHORIZED", async () => {
		const ctx = {
			userId: "member-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "host-1",
							autoEndTurnAfterHoursInactive: 0,
							autoEndTurnEveryHours: 0,
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "member-1",
						}),
					},
				},
				update: vi.fn(),
			},
		};

		await expect(
			callUpdateGameSettings(
				{},
				{
					gameId: "game-1",
					input: {
						autoEndTurnAfterHoursInactive: 8,
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to configure this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("clears periodic mode when setting inactivity mode only", async () => {
		const returning = vi.fn().mockResolvedValue([
			{
				id: "game-1",
				autoEndTurnAfterHoursInactive: 6,
				autoEndTurnEveryHours: 0,
			},
		]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });

		const ctx = {
			userId: "host-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							hostUserId: "host-1",
							autoEndTurnAfterHoursInactive: 0,
							autoEndTurnEveryHours: 12,
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "host-1",
						}),
					},
				},
				update,
			},
		};

		await callUpdateGameSettings(
			{},
			{
				gameId: "game-1",
				input: {
					autoEndTurnAfterHoursInactive: 6,
				},
			},
			ctx as never,
			{} as never,
		);

		expect(set).toHaveBeenCalledWith({
			autoEndTurnAfterHoursInactive: 6,
			autoEndTurnEveryHours: 0,
		});
	});

	it("rejects short game names with INVALID_GAME_NAME", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				transaction: vi.fn(),
			},
		};

		await expect(
			callCreateGame({}, { name: "ab" }, ctx as never, {} as never),
		).rejects.toMatchObject(
			createGraphQLError("Game name must be between 3 and 64 characters", {
				extensions: { code: "INVALID_GAME_NAME" },
			}),
		);
	});
});
