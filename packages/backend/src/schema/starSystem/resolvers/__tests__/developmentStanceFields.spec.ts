import { describe, expect, it, vi } from "vitest";
import { StarSystem } from "../StarSystem.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const currentDevelopmentStanceResolver = resolverFn(
	StarSystem.currentDevelopmentStance as CallableResolver<
		[unknown, unknown, unknown, unknown],
		unknown
	>,
);

const nextTurnStanceProjectionResolver = resolverFn(
	StarSystem.nextTurnStanceProjection as CallableResolver<
		[unknown, unknown, unknown, unknown],
		unknown
	>,
);

describe("StarSystem development stance fields", () => {
	it("returns default balance stance for owner when no explicit stance exists", async () => {
		const result = await currentDevelopmentStanceResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				ownerId: "user-1",
			} as never,
			{},
			{
				userId: "user-1",
				drizzle: {
					query: {
						games: {
							findFirst: vi.fn().mockResolvedValue({ turnNumber: 9 }),
						},
						starSystemDevelopmentStances: {
							findFirst: vi.fn().mockResolvedValue(null),
						},
					},
				},
			} as never,
			{} as never,
		);

		expect(result).toBe("balance");
	});

	it("returns projection deltas for explicit stance", async () => {
		const selectWhere = vi
			.fn()
			.mockResolvedValue([{ amount: 1000000n, growthLeftover: "0" }]);

		const projection = await nextTurnStanceProjectionResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				ownerId: "user-1",
			} as never,
			{},
			{
				userId: "user-1",
				drizzle: {
					query: {
						games: {
							findFirst: vi.fn().mockResolvedValue({ turnNumber: 9 }),
						},
						starSystemDevelopmentStances: {
							findFirst: vi.fn().mockResolvedValue({
								stance: "grow_population",
							}),
						},
					},
					select: vi.fn().mockReturnValue({
						from: vi.fn().mockReturnValue({ where: selectWhere }),
					}),
				},
			} as never,
			{} as never,
		);

		expect(projection).toMatchObject({
			industryDelta: 0,
			populationDelta: 1200n,
		});
	});
});
