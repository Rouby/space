import { eq, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { bufferWhen, filter, map, merge, scan, tap } from "rxjs";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.ts";
export const trackStarSystem: NonNullable<
	SubscriptionResolvers["trackStarSystem"]
> = {
	subscribe: async (_parent, { starSystemId }, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		const [ss] = await ctx.drizzle
			.select()
			.from(starSystems)
			.where(eq(starSystems.id, starSystemId));

		if (!ss) {
			throw createGraphQLError("Star system not found");
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
			map((events) => ({
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

		return toAsyncIterable(
			merge(
				thresholdDiscoveryEvents,
				thresholdPopulationChangeEvents,
				commisionUpdates,
			),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
