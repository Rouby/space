import { describe, expect, it, vi } from "vitest";
import { IndustrialProject } from "../IndustrialProject.js";
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

const industryResolver = resolverFn(
	StarSystem.industry as CallableResolver<
		[unknown, unknown, unknown, unknown],
		unknown
	>,
);

const industryBreakdownResolver = resolverFn(
	StarSystem.industryBreakdown as CallableResolver<
		[unknown, unknown, unknown, unknown],
		unknown
	>,
);

const completedIndustrialProjectsResolver = resolverFn(
	StarSystem.completedIndustrialProjects as CallableResolver<
		[unknown, unknown, unknown, unknown],
		unknown
	>,
);

const industrialProjectMaintenanceCostResolver = resolverFn(
	IndustrialProject.maintenanceCost as CallableResolver<
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

	it("returns population-capped industry", async () => {
		const selectWhere = vi
			.fn()
			.mockResolvedValue([{ amount: 10_000_000_000n }]);
		const findMany = vi.fn().mockResolvedValue([]);

		const industry = await industryResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				industry: 20,
			} as never,
			{},
			{
				drizzle: {
					query: {
						starSystemIndustrialProjects: {
							findMany,
						},
					},
					select: vi.fn().mockReturnValue({
						from: vi.fn().mockReturnValue({ where: selectWhere }),
					}),
				},
			} as never,
			{} as never,
		);

		expect(industry).toBe(13);
	});

	it("returns industry breakdown with maintenance and net output", async () => {
		const selectWhere = vi.fn().mockResolvedValue([{ amount: 1_700_000_000n }]);
		const findMany = vi.fn().mockResolvedValue([
			{
				projectType: "factory_expansion",
				maintenanceCost: 1,
				completedAtTurn: 3,
			},
			{
				projectType: "factory_expansion",
				maintenanceCost: 1,
				completedAtTurn: 5,
			},
			{
				projectType: "automation_hub",
				maintenanceCost: 2,
				completedAtTurn: null,
			},
		]);

		const breakdown = await industryBreakdownResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				industry: 8,
			} as never,
			{},
			{
				drizzle: {
					query: {
						starSystemIndustrialProjects: {
							findMany,
						},
					},
					select: vi.fn().mockReturnValue({
						from: vi.fn().mockReturnValue({ where: selectWhere }),
					}),
				},
			} as never,
			{} as never,
		);

		expect(breakdown).toMatchObject({
			rawIndustry: 8,
			populationCap: 3,
			cappedIndustry: 3,
			maintenance: 2,
			netIndustry: 1,
		});
	});

	it("returns ramped maintenance costs for completed duplicate projects", async () => {
		const findMany = vi.fn().mockResolvedValue([
			{
				id: "built-3",
				gameId: "game-1",
				starSystemId: "ss-1",
				projectType: "factory_expansion",
				industryPerTurn: 3,
				workRequired: 12,
				workDone: 12,
				completionIndustryBonus: 2,
				maintenanceCost: 1,
				queuePosition: 3,
				queuedAtTurn: 1,
				startedAtTurn: 2,
				completedAtTurn: 6,
				createdAt: new Date("2026-01-03T00:00:00Z"),
			},
			{
				id: "built-2",
				gameId: "game-1",
				starSystemId: "ss-1",
				projectType: "factory_expansion",
				industryPerTurn: 3,
				workRequired: 12,
				workDone: 12,
				completionIndustryBonus: 2,
				maintenanceCost: 1,
				queuePosition: 2,
				queuedAtTurn: 1,
				startedAtTurn: 2,
				completedAtTurn: 5,
				createdAt: new Date("2026-01-02T00:00:00Z"),
			},
			{
				id: "built-1",
				gameId: "game-1",
				starSystemId: "ss-1",
				projectType: "factory_expansion",
				industryPerTurn: 3,
				workRequired: 12,
				workDone: 12,
				completionIndustryBonus: 2,
				maintenanceCost: 1,
				queuePosition: 1,
				queuedAtTurn: 1,
				startedAtTurn: 2,
				completedAtTurn: 3,
				createdAt: new Date("2026-01-01T00:00:00Z"),
			},
		]);

		const completedProjects = (await completedIndustrialProjectsResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				industry: 8,
			} as never,
			{},
			{
				drizzle: {
					query: {
						starSystemIndustrialProjects: {
							findMany,
						},
					},
				},
			} as never,
			{} as never,
		)) as Array<Record<string, unknown>>;

		expect(completedProjects).toHaveLength(3);
		const resolvedMaintenanceCosts = (await Promise.all(
			completedProjects.map((project) =>
				industrialProjectMaintenanceCostResolver(
					project as never,
					{},
					{} as never,
					{} as never,
				),
			),
		)) as number[];

		expect(resolvedMaintenanceCosts.sort((a, b) => a - b)).toEqual([1, 1, 2]);
	});

	it("projects zero effective industry gain when already above the population cap", async () => {
		const selectWhere = vi
			.fn()
			.mockResolvedValue([{ amount: 10_000_000_000n, growthLeftover: "0" }]);

		const projection = await nextTurnStanceProjectionResolver(
			{
				id: "ss-1",
				gameId: "game-1",
				ownerId: "user-1",
				industry: 20,
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
								stance: "industrialize",
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
		});
	});
});
