import { createGraphQLError } from "graphql-yoga";
import { Subject } from "rxjs";
import { describe, expect, it, vi } from "vitest";
import { trackStarSystem } from "../../../base/resolvers/Subscription/trackStarSystem.ts";

const trackStarSystemSubscribe =
	typeof trackStarSystem === "function"
		? trackStarSystem
		: trackStarSystem.subscribe;

function denyAccess({
	message,
	code,
}: {
	message: string;
	code: string;
}): never {
	throw createGraphQLError(message, { extensions: { code } });
}

describe("trackStarSystem subscription", () => {
	it("emits a star-system update when owner changes", async () => {
		const events$ = new Subject<{
			type: string;
			id: string;
			ownerId?: string;
			turnsRemaining?: number;
		}>();
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi.fn().mockResolvedValue(true),
			denyAccess: vi.fn(denyAccess),
			fromGameEvents: vi.fn().mockReturnValue(events$.asObservable()),
			drizzle: {
				select: vi.fn().mockReturnValue({
					from: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue([
							{
								id: "ss-1",
								gameId: "game-1",
								name: "Target",
								position: { x: 0, y: 0 },
								ownerId: null,
								discoveryProgress: "0",
							},
						]),
					}),
				}),
				query: {
					players: {
						findFirst: vi.fn().mockResolvedValue({
							userId: "user-1",
							gameId: "game-1",
						}),
					},
				},
			},
		};

		const iterable = (await trackStarSystemSubscribe?.(
			{},
			{ starSystemId: "ss-1" },
			ctx as never,
			{} as never,
		)) as AsyncIterable<unknown>;
		expect(iterable).toBeDefined();

		const iterator = iterable?.[Symbol.asyncIterator]();
		expect(iterator).toBeDefined();

		const nextUpdate = iterator?.next();
		events$.next({
			type: "starSystem:ownerChanged",
			id: "ss-1",
			ownerId: "user-2",
		});

		await expect(nextUpdate).resolves.toMatchObject({
			done: false,
			value: {
				__typename: "StarSystemUpdateEvent",
				subject: {
					id: "ss-1",
					ownerId: "user-2",
				},
			},
		});

		await iterator?.return?.();
		events$.complete();
	});

	it("denies updates when vision is revoked after subscription starts", async () => {
		const events$ = new Subject<{
			type: string;
			id: string;
			ownerId?: string;
			turnsRemaining?: number;
		}>();
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			hasVision: vi
				.fn()
				.mockResolvedValueOnce(true)
				.mockResolvedValueOnce(false),
			denyAccess: vi.fn(denyAccess),
			fromGameEvents: vi.fn().mockReturnValue(events$.asObservable()),
			drizzle: {
				select: vi.fn().mockReturnValue({
					from: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue([
							{
								id: "ss-1",
								gameId: "game-1",
								name: "Target",
								position: { x: 0, y: 0 },
								ownerId: null,
								discoveryProgress: "0",
							},
						]),
					}),
				}),
				query: {
					players: {
						findFirst: vi.fn().mockResolvedValue({
							userId: "user-1",
							gameId: "game-1",
						}),
					},
				},
			},
		};

		const iterable = (await trackStarSystemSubscribe?.(
			{},
			{ starSystemId: "ss-1" },
			ctx as never,
			{} as never,
		)) as AsyncIterable<unknown>;

		const iterator = iterable?.[Symbol.asyncIterator]();
		const nextUpdate = iterator?.next();
		events$.next({
			type: "starSystem:colonizationProgress",
			id: "ss-1",
			turnsRemaining: 1,
		});

		await expect(nextUpdate).rejects.toMatchObject(
			createGraphQLError("Not authorized to track this star system", {
				extensions: { code: "NOT_AUTHORIZED" },
			}),
		);

		events$.complete();
	});
});
