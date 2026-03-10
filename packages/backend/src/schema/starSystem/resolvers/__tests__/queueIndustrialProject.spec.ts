import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { queueIndustrialProject } from "../Mutation/queueIndustrialProject.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callQueueIndustrialProject = resolverFn(queueIndustrialProject);

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("queueIndustrialProject mutation", () => {
	it("rejects non-owners with NOT_AUTHORIZED", async () => {
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
						findFirst: vi.fn().mockResolvedValue({ userId: "user-1" }),
					},
				},
			},
		};

		await expect(
			callQueueIndustrialProject(
				{},
				{ starSystemId: "ss-1", projectType: "factory_expansion" },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError(
				"Not authorized to queue industrial projects for this star system",
				{
					extensions: { code: "NOT_AUTHORIZED" },
				},
			),
		);
	});

	it("rejects invalid project type", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: { query: {} },
		};

		await expect(
			callQueueIndustrialProject(
				{},
				{ starSystemId: "ss-1", projectType: "unknown_project" as never },
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Invalid industrial project type", {
				extensions: { code: "INVALID_INDUSTRIAL_PROJECT_TYPE" },
			}),
		);
	});

	it("queues industrial project with next FIFO position", async () => {
		const insertValues = vi.fn().mockResolvedValue(undefined);
		const where = vi.fn().mockResolvedValue([{ maxQueuePosition: 2 }]);
		const from = vi.fn().mockReturnValue({ where });
		const select = vi.fn().mockReturnValue({ from });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					starSystems: {
						findFirst: vi.fn().mockResolvedValue({
							id: "ss-1",
							name: "Vega",
							gameId: "game-1",
							ownerId: "user-1",
							position: { x: 0, y: 0 },
							discoverySlots: 0,
							discoveryProgress: "0",
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue({ userId: "user-1" }),
					},
					games: {
						findFirst: vi.fn().mockResolvedValue({
							id: "game-1",
							turnNumber: 4,
							startedAt: new Date(),
						}),
					},
				},
				select,
				insert: vi.fn().mockReturnValue({ values: insertValues }),
			},
		};

		const result = await callQueueIndustrialProject(
			{},
			{ starSystemId: "ss-1", projectType: "factory_expansion" },
			ctx as never,
			{} as never,
		);

		expect(insertValues).toHaveBeenCalledWith(
			expect.objectContaining({
				starSystemId: "ss-1",
				gameId: "game-1",
				playerId: "user-1",
				projectType: "factory_expansion",
				queuePosition: 3,
				queuedAtTurn: 4,
			}),
		);
		expect(result).toMatchObject({ id: "ss-1", isVisible: true });
	});
});
