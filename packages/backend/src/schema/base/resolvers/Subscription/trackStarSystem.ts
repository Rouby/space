import { and, eq, players, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { bufferWhen, filter, map, merge, mergeMap, scan, tap } from "rxjs";
import type { Context } from "../../../../context.js";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.ts";
export const trackStarSystem: NonNullable<
	SubscriptionResolvers["trackStarSystem"]
> = {
	subscribe: async (_parent, { starSystemId }, ctx) => {
		const context: Context = ctx;
		context.throwWithoutClaim("urn:space:claim");

		const [ss] = await ctx.drizzle
			.select()
			.from(starSystems)
			.where(eq(starSystems.id, starSystemId));

		if (!ss) {
			throw createGraphQLError("Star system not found");
		}

		const player = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.gameId, ss.gameId),
				eq(players.userId, context.userId),
			),
		});

		if (!player) {
			context.denyAccess({
				message: "Not authorized to track this star system",
				code: "NOT_AUTHORIZED",
				reason: "track-star-system-not-member",
				details: { gameId: ss.gameId, starSystemId },
			});
		}

		const canSeeSystem = await context.hasVision(ss.gameId, ss.position);

		if (!canSeeSystem) {
			context.denyAccess({
				message: "Not authorized to track this star system",
				code: "NOT_AUTHORIZED",
				reason: "track-star-system-no-vision",
				details: { gameId: ss.gameId, starSystemId },
			});
		}

		const discoveryEvents = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "starSystem:discoveryProgress"),
			filter((event) => event.id === starSystemId),
		);
		const thresholdDiscoveryEvents = discoveryEvents.pipe(
			bufferWhen(() =>
				discoveryEvents.pipe(
					scan((acc, event) => acc + event.discoveryProgressChange, 0),
					filter((progress) => progress >= 0.01),
				),
			),
			map((events) => ({
				__typename: "StarSystemUpdateEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
					discoveryProgress: events.at(-1)?.discoveryProgress ?? 0,
				},
			})),
			tap((event) => {
				ss.discoveryProgress = `${event.subject.discoveryProgress}`;
			}),
		);

		const populationChangeEvents = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "starSystem:populationChanged"),
			filter((event) => event.id === starSystemId),
		);

		const magnitude = 6n;
		const thresholdPopulationChangeEvents = populationChangeEvents.pipe(
			bufferWhen(() =>
				populationChangeEvents.pipe(
					scan((acc, event) => acc + event.growthPerTick, 0n),
					filter((count) => count >= 10n ** magnitude),
				),
			),
			map((_events) => ({
				__typename: "StarSystemUpdateEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
				},
			})),
		);

		const commisionUpdates = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "taskForceCommision:progress"),
			filter((event) => event.starSystemId === starSystemId),
			map((event) => ({
				__typename: "TaskForceCommisionUpdateEvent" as const,
				subject: {
					__typename: "TaskForceShipCommision" as const,
					id: event.id,
					constructionDone: event.constructionDone,
					constructionTotal: event.constructionTotal,
					constructionPerTick: event.constructionPerTick,
				},
			})),
		);

		const colonizationUpdates = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "starSystem:colonizationProgress"),
			filter((event) => event.id === starSystemId),
			map((_event) => ({
				__typename: "StarSystemUpdateEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
				},
			})),
		);

		const ownerChangedUpdates = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "starSystem:ownerChanged"),
			filter((event) => event.id === starSystemId),
			map((event) => ({
				__typename: "StarSystemUpdateEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
					ownerId: event.ownerId,
				},
			})),
			tap((event) => {
				ss.ownerId = event.subject.ownerId;
			}),
		);

		const industrialProjectProgressUpdates = ctx.fromGameEvents(ss.gameId).pipe(
			filter((event) => event.type === "starSystem:industrialProjectProgress"),
			filter((event) => event.starSystemId === starSystemId),
			map((_event) => ({
				__typename: "StarSystemUpdateEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
				},
			})),
		);

		const industrialProjectCompletedUpdates = ctx
			.fromGameEvents(ss.gameId)
			.pipe(
				filter(
					(event) => event.type === "starSystem:industrialProjectCompleted",
				),
				filter((event) => event.starSystemId === starSystemId),
				map((event) => ({
					__typename: "StarSystemUpdateEvent" as const,
					subject: {
						__typename: "StarSystem" as const,
						...ss,
						industry: event.newIndustryTotal,
					},
				})),
				tap((event) => {
					ss.industry = event.subject.industry;
				}),
			);

		return toAsyncIterable(
			merge(
				thresholdDiscoveryEvents,
				thresholdPopulationChangeEvents,
				colonizationUpdates,
				ownerChangedUpdates,
				industrialProjectProgressUpdates,
				industrialProjectCompletedUpdates,
				commisionUpdates,
			).pipe(
				mergeMap(async (event) => {
					const hasCurrentVision = await context.hasVision(
						ss.gameId,
						ss.position,
					);
					if (!hasCurrentVision) {
						context.denyAccess({
							message: "Not authorized to track this star system",
							code: "NOT_AUTHORIZED",
							reason: "track-star-system-vision-revoked",
							details: { gameId: ss.gameId, starSystemId },
						});
					}

					return event;
				}),
			),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: can be any
	resolve: (input: any) => input,
};
