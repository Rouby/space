import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { setResearchFocus } from "../Mutation/setResearchFocus.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callSetResearchFocus = resolverFn(setResearchFocus);

describe("setResearchFocus mutation", () => {
	it("rejects equal primary and secondary categories", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn(),
					},
					players: {
						findFirst: vi.fn(),
					},
				},
			},
		};

		await expect(
			callSetResearchFocus(
				{},
				{
					gameId: "game-1",
					primaryCategory: "industry",
					secondaryCategory: "industry",
					methodology: "stable",
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError(
				"Primary and secondary research categories must be different",
				{
					extensions: { code: "INVALID_RESEARCH_DIRECTIVE" },
				},
			),
		);
	});

	it("upserts directive for current turn when input is valid", async () => {
		const returning = vi.fn().mockResolvedValue([]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });
		const values = vi.fn().mockResolvedValue(undefined);
		const insert = vi.fn().mockReturnValue({ values });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 4,
							startedAt: new Date(),
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({
							gameId: "game-1",
							userId: "user-1",
							user: { id: "user-1", name: "User" },
						}),
					},
					playerResearchDirectives: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
				update,
				insert,
			},
		};

		const result = await callSetResearchFocus(
			{},
			{
				gameId: "game-1",
				primaryCategory: "industry",
				secondaryCategory: "discovery",
				methodology: "opportunistic",
			},
			ctx as never,
			{} as never,
		);

		expect(update).toHaveBeenCalledTimes(1);
		expect(set).toHaveBeenCalledWith(
			expect.objectContaining({
				primaryCategory: "industry",
				secondaryCategory: "discovery",
				methodology: "opportunistic",
			}),
		);
		expect(insert).toHaveBeenCalledTimes(1);
		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: "game-1",
				playerId: "user-1",
				turnNumber: 4,
				primaryCategory: "industry",
				secondaryCategory: "discovery",
				methodology: "opportunistic",
			}),
		);
		expect(result).toMatchObject({ userId: "user-1", gameId: "game-1" });
	});

	it("rejects game that has not started", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 2,
							startedAt: null,
						}),
					},
					players: {
						findFirst: vi.fn(),
					},
				},
			},
		};

		await expect(
			callSetResearchFocus(
				{},
				{
					gameId: "game-1",
					primaryCategory: "military",
					secondaryCategory: "industry",
					methodology: "bold",
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Game has not started yet", {
				extensions: { code: "GAME_NOT_STARTED" },
			}),
		);
	});
});
