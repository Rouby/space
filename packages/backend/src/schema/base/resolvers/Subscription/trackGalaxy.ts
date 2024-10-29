import {
	and,
	eq,
	exists,
	sql,
	starSystems,
	taskForces,
	visibility,
} from "@space/data/schema";
import {
	concat,
	filter,
	from,
	map,
	merge,
	mergeMap,
	startWith,
	takeUntil,
} from "rxjs";
import { taskForces$ } from "../../../../observables/taskForces.ts";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type {
	ResolversTypes,
	SubscriptionResolvers,
} from "./../../../types.generated.js";
export const trackGalaxy: NonNullable<SubscriptionResolvers["trackGalaxy"]> = {
	subscribe: async (_parent, { gameId }, ctx) => {
		ctx.throwWithoutClaim("urn:space:claim");

		const initialTfs = await ctx.drizzle
			.select()
			.from(taskForces)
			.where(
				and(
					eq(taskForces.gameId, gameId),
					exists(
						ctx.drizzle
							.select({ circle: visibility.circle })
							.from(visibility)
							.where(
								and(
									eq(visibility.gameId, taskForces.gameId),
									eq(visibility.userId, ctx.userId ?? ""),
									sql`${visibility.circle} @> ${taskForces.position}`,
								),
							),
					),
				),
			);

		const taskForceEvents = taskForces$({
			gameId,
			userId: ctx.userId ?? "",
			initialTaskForces: initialTfs,
		});

		const initialSSs = await ctx.drizzle
			.select()
			.from(starSystems)
			.where(
				and(
					eq(starSystems.gameId, gameId),
					exists(
						ctx.drizzle
							.select({ circle: visibility.circle })
							.from(visibility)
							.where(
								and(
									eq(visibility.gameId, starSystems.gameId),
									eq(visibility.userId, ctx.userId ?? ""),
									sql`${visibility.circle} @> ${starSystems.position}`,
								),
							),
					),
				),
			);

		const starSystemEvents = ctx.fromGameEvents(gameId).pipe(
			filter((event) => event.type === "starSystem:appeared"),
			filter((event) => event.userId === ctx.userId),
			map((event) => ({
				__typename: "PositionableApppearsEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					id: event.id,
					position: event.position,
					isVisible: true,
					lastUpdate: null,
				},
			})),
			// and initially feed all visible sss as "appearing"
			startWith(
				...initialSSs.map((ss) => ({
					__typename: "PositionableApppearsEvent" as const,
					subject: {
						__typename: "StarSystem" as const,
						...ss,
						isVisible: true,
						lastUpdate: null,
					},
				})),
			),
			mergeMap((appeared) =>
				// for each appear event, emit appear and wait until disappear
				concat(
					from([appeared]),
					// add owner-change-events
					ctx
						.fromGameEvents(gameId)
						.pipe(
							filter((event) => event.type === "starSystem:ownerChanged"),
							filter((event) => event.id === appeared.subject.id),
							map((event) => ({
								__typename: "StarSystemUpdateEvent" as const,
								subject: {
									...appeared.subject,
									id: appeared.subject.id,
									ownerId: event.ownerId,
									gameId,
								},
							})),
							// until the star system disappears
							takeUntil(
								ctx.fromGameEvents(gameId).pipe(
									filter((event) => event.type === "starSystem:disappeared"),
									filter((event) => event.id === appeared.subject.id),
									filter((event) => event.userId === ctx.userId),
								),
							),
						),
					from([
						{
							__typename: "PositionableDisappearsEvent" as const,
							subject: {
								...appeared.subject,
								isVisible: false,
								lastUpdate: new Date().toISOString(),
							},
						},
					]),
				),
			),
		);

		return toAsyncIterable<ResolversTypes["TrackGalaxyEvent"]>(
			// @ts-expect-error: TODO: fix this
			merge(taskForceEvents, starSystemEvents),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
