import {
	and,
	eq,
	exists,
	sql,
	taskForces,
	visibility,
} from "@space/data/schema";
import {
	concat,
	filter,
	from,
	map,
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

		const trackTaskForces = ctx.fromGameEvents(gameId).pipe(
			// collect all appear-events
			filter((event) => event.type === "taskForce:appeared"),
			filter((event) => event.userId === ctx.userId),
			map((event) => ({
				__typename: "PositionableApppearsEvent" as const,
				subject: {
					__typename: "TaskForce",
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
						__typename: "TaskForce",
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
								__typename: "TaskForce",
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
								__typename: "TaskForce",
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

		// @ts-expect-error: TODO: fix this
		return toAsyncIterable<ResolversTypes["TrackGalaxyEvent"]>(trackTaskForces);
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
