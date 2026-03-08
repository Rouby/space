import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { configureTaskForceCombatDeck } from "../Mutation/configureTaskForceCombatDeck.ts";
import { constructTaskForce } from "../Mutation/constructTaskForce.ts";
import { orderTaskForce } from "../Mutation/orderTaskForce.ts";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callConstructTaskForce = resolverFn(constructTaskForce);
const callOrderTaskForce = resolverFn(orderTaskForce);
const callConfigureTaskForceCombatDeck = resolverFn(
	configureTaskForceCombatDeck,
);

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("task force construction and movement rules", () => {
	it("rejects constructTaskForce for non-members", async () => {
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
							ownerId: "user-1",
							position: { x: 0, y: 0 },
						}),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
			},
		};

		await expect(
			callConstructTaskForce(
				{},
				{
					input: {
						starSystemId: "ss-1",
						shipDesignId: "sd-1",
						name: "New Fleet",
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Not authorized to construct fleets in this game", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);
	});

	it("rejects move orders beyond reachable distance", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							position: { x: 0, y: 0 },
							orders: [],
						}),
					},
				},
			},
		};

		await expect(
			callOrderTaskForce(
				{},
				{
					id: "tf-1",
					queue: false,
					orders: [{ move: { destination: { x: 2001, y: 0 } } }],
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Move destination is out of range", {
				extensions: { code: "INVALID_TASK_FORCE_ORDER" },
			}),
		);
	});

	it("validates queued move orders against projected queued position", async () => {
		const returning = vi.fn().mockResolvedValue([
			{
				id: "tf-1",
				ownerId: "user-1",
				position: { x: 0, y: 0 },
				orders: [
					{
						id: "existing-1",
						type: "move",
						destination: { x: 900, y: 0 },
					},
				],
			},
		]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							position: { x: 0, y: 0 },
							orders: [
								{
									id: "existing-1",
									type: "move",
									destination: { x: 900, y: 0 },
								},
							],
						}),
					},
				},
				update,
			},
		};

		await expect(
			callOrderTaskForce(
				{},
				{
					id: "tf-1",
					queue: true,
					orders: [{ move: { destination: { x: 2100, y: 0 } } }],
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Move destination is out of range", {
				extensions: { code: "INVALID_TASK_FORCE_ORDER" },
			}),
		);

		expect(update).not.toHaveBeenCalled();
	});

	it("rejects combat deck configuration when deck size is not exactly 12", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							combatDeck: [],
						}),
					},
				},
			},
		};

		await expect(
			callConfigureTaskForceCombatDeck(
				{},
				{
					input: {
						taskForceId: "tf-1",
						cardIds: ["laser_burst"],
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Combat deck must contain exactly 12 cards", {
				extensions: { code: "INVALID_DECK_SIZE" },
			}),
		);
	});

	it("rejects combat deck cards outside the allowed MVP pool", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							combatDeck: [],
						}),
					},
				},
			},
		};

		await expect(
			callConfigureTaskForceCombatDeck(
				{},
				{
					input: {
						taskForceId: "tf-1",
						cardIds: [
							"laser_burst",
							"laser_burst",
							"target_lock",
							"target_lock",
							"emergency_repairs",
							"emergency_repairs",
							"shield_pulse",
							"shield_pulse",
							"evasive_maneuver",
							"evasive_maneuver",
							"overcharge_barrage",
							"unknown_card",
						],
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Card is not allowed in MVP deck", {
				extensions: { code: "CARD_NOT_ALLOWED" },
			}),
		);
	});

	it("rejects combat deck configuration when duplicates exceed max limit", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							combatDeck: [],
						}),
					},
				},
			},
		};

		await expect(
			callConfigureTaskForceCombatDeck(
				{},
				{
					input: {
						taskForceId: "tf-1",
						cardIds: [
							"laser_burst",
							"laser_burst",
							"laser_burst",
							"target_lock",
							"target_lock",
							"emergency_repairs",
							"emergency_repairs",
							"shield_pulse",
							"shield_pulse",
							"evasive_maneuver",
							"evasive_maneuver",
							"overcharge_barrage",
						],
					},
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Duplicate limit exceeded for card", {
				extensions: { code: "DUPLICATE_CARD_LIMIT_EXCEEDED" },
			}),
		);
	});

	it("denies combat deck configuration for task force not owned by caller", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue(null),
					},
				},
			},
		};

		const validDeck = [
			"laser_burst",
			"laser_burst",
			"target_lock",
			"target_lock",
			"emergency_repairs",
			"emergency_repairs",
			"shield_pulse",
			"shield_pulse",
			"evasive_maneuver",
			"evasive_maneuver",
			"overcharge_barrage",
			"overcharge_barrage",
		];

		await expect(
			callConfigureTaskForceCombatDeck(
				{},
				{
					input: {
						taskForceId: "tf-not-owned",
						cardIds: validDeck,
					},
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

	it("accepts a valid 12-card deck with max-2 duplicates", async () => {
		const returning = vi.fn().mockResolvedValue([
			{
				id: "tf-1",
				ownerId: "user-1",
				name: "Alpha",
				gameId: "game-1",
				position: { x: 0, y: 0 },
				orders: [],
				movementVector: null,
				combatDeck: [],
			},
		]);
		const where = vi.fn().mockReturnValue({ returning });
		const set = vi.fn().mockReturnValue({ where });
		const update = vi.fn().mockReturnValue({ set });

		const validDeck = [
			"laser_burst",
			"laser_burst",
			"target_lock",
			"target_lock",
			"emergency_repairs",
			"emergency_repairs",
			"shield_pulse",
			"shield_pulse",
			"evasive_maneuver",
			"evasive_maneuver",
			"overcharge_barrage",
			"overcharge_barrage",
		];

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			denyAccess: vi.fn(denyAccess),
			drizzle: {
				query: {
					taskForces: {
						findFirst: vi.fn().mockResolvedValue({
							id: "tf-1",
							ownerId: "user-1",
							combatDeck: [],
						}),
					},
				},
				update,
			},
		};

		await expect(
			callConfigureTaskForceCombatDeck(
				{},
				{
					input: {
						taskForceId: "tf-1",
						cardIds: validDeck,
					},
				},
				ctx as never,
				{} as never,
			),
		).resolves.toMatchObject({ id: "tf-1" });

		expect(set).toHaveBeenCalledWith({ combatDeck: validDeck });
	});
});
