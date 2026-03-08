import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { startColonization } from "../Mutation/startColonization.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callStartColonization = resolverFn(startColonization);

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("startColonization mutation", () => {
	it("rejects non-members with NOT_AUTHORIZED", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(true),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							gameId: "game-1",
							ownerId: null,
							position: { x: 100, y: 0 },
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
			},
		};

		await expect(
			callStartColonization(
				{},
				{ starSystemId: "ss-1" },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to colonize in this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("creates colonization process with turns derived from distance", async () => {
		const insertValues = vi.fn().mockResolvedValue(undefined);
		const limit = vi
			.fn()
			.mockResolvedValue([{ id: "origin-1", distance: 500 }]);
		const orderBy = vi.fn().mockReturnValue({ limit });
		const where = vi.fn().mockReturnValue({ orderBy });
		const from = vi.fn().mockReturnValue({ where });
		const select = vi.fn().mockReturnValue({ from });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(true),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi
							.fn()
							.mockResolvedValueOnce({
								id: "ss-1",
								name: "Unclaimed",
								gameId: "game-1",
								ownerId: null,
								position: { x: 500, y: 0 },
								discoverySlots: 0,
								discoveryProgress: "0",
							})
							.mockResolvedValueOnce(null),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
						}),
					},
					starSystemColonizations: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({ turnNumber: 7 }),
					},
				},
				select,
				insert: vi.fn().mockReturnValue({ values: insertValues }),
			},
		};

		const result = await callStartColonization(
			{},
			{ starSystemId: "ss-1" },
			ctx as never,
			{} as never,
		);

		expect(insertValues).toHaveBeenCalledWith(
			expect.objectContaining({
				starSystemId: "ss-1",
				gameId: "game-1",
				playerId: "user-1",
				originStarSystemId: "origin-1",
				startedAtTurn: 7,
				turnsRequired: 4,
				dueTurn: 11,
			}),
		);
		expect(result).toMatchObject({ id: "ss-1", isVisible: true });
	});

	it("rejects already colonized targets", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(true),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							gameId: "game-1",
							ownerId: "user-2",
							position: { x: 100, y: 0 },
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
			callStartColonization(
				{},
				{ starSystemId: "ss-1" },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Star system is already colonized", {
				extensions: { code: "INVALID_COLONIZATION_TARGET" },
			}),
		);
	});

	it("maps insert conflicts to COLONIZATION_ALREADY_IN_PROGRESS", async () => {
		const limit = vi
			.fn()
			.mockResolvedValue([{ id: "origin-1", distance: 500 }]);
		const orderBy = vi.fn().mockReturnValue({ limit });
		const where = vi.fn().mockReturnValue({ orderBy });
		const from = vi.fn().mockReturnValue({ where });
		const select = vi.fn().mockReturnValue({ from });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(true),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							name: "Unclaimed",
							gameId: "game-1",
							ownerId: null,
							position: { x: 500, y: 0 },
							discoverySlots: 0,
							discoveryProgress: "0",
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
						}),
					},
					starSystemColonizations: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({ turnNumber: 7 }),
					},
				},
				select,
				insert: vi.fn().mockReturnValue({
					values: vi.fn().mockRejectedValue({ code: "23505" }),
				}),
			},
		};

		await expect(
			callStartColonization(
				{},
				{ starSystemId: "ss-1" },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Colonization already in progress", {
				extensions: { code: "COLONIZATION_ALREADY_IN_PROGRESS" },
			}),
		);
	});
});
