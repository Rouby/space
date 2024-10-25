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
	pairwise,
	raceWith,
	startWith,
	takeUntil,
} from "rxjs";
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

		const taskForceEvents = ctx.fromGameEvents(gameId).pipe(
			// collect all appear-events
			filter((event) => event.type === "taskForce:appeared"),
			filter((event) => event.userId === ctx.userId),
			map((event) => ({
				__typename: "PositionableApppearsEvent" as const,
				subject: {
					__typename: "TaskForce" as const,
					id: event.id,
					position: event.position,
					movementVector: event.movementVector,
					isVisible: true,
					lastUpdate: null,
				},
			})),
			// and initially feed all visible tfs as "appearing"
			startWith(
				...initialTfs.map((tf) => ({
					__typename: "PositionableApppearsEvent" as const,
					subject: {
						__typename: "TaskForce" as const,
						id: tf.id,
						position: tf.position,
						movementVector: tf.movementVector,
						isVisible: true,
						lastUpdate: null,
					},
				})),
			),
			mergeMap((appeared) =>
				// for each appear event, start emitting position updates
				concat(
					// double emit because pairwise does not emit on first event
					from([appeared, appeared]),
					ctx.fromGameEvents(gameId).pipe(
						filter((event) => event.type === "taskForce:position"),
						filter((event) => event.id === appeared.subject.id),
						map((event) => ({
							__typename: "PositionableMovesEvent" as const,
							subject: {
								__typename: "TaskForce" as const,
								id: event.id,
								position: event.position,
								movementVector: event.movementVector,
							},
						})),
						// until the task force disappears or is destroyed
						takeUntil(
							ctx.fromGameEvents(gameId).pipe(
								filter((event) => event.type === "taskForce:disappeared"),
								filter((event) => event.id === appeared.subject.id),
								filter((event) => event.userId === ctx.userId),
								raceWith(
									ctx.fromGameEvents(gameId).pipe(
										filter((event) => event.type === "taskForce:destroyed"),
										filter((event) => event.id === appeared.subject.id),
									),
								),
							),
						),
					),
					from([
						{
							__typename: "PositionableDisappearsEvent" as const,
							subject: {
								__typename: "TaskForce" as const,
								id: appeared.subject.id,
								isVisible: false,
								lastUpdate: new Date().toISOString(),
								// position will be updated in mapping below
								position: appeared.subject.position,
							},
						},
					]),
				).pipe(
					// keep track of current and previous event to update position on disappear as last-known position
					pairwise(),
					map(([prev, next]) =>
						next.__typename === "PositionableDisappearsEvent"
							? {
									...next,
									subject: { ...next.subject, position: prev.subject.position },
								}
							: next,
					),
				),
			),
		);

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
						id: ss.id,
						position: ss.position,
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
									__typename: "StarSystem" as const,
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
								__typename: "StarSystem" as const,
								id: appeared.subject.id,
								position: appeared.subject.position,
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
