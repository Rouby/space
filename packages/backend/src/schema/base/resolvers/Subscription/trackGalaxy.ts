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
	startWith,
	takeUntil,
} from "rxjs";
import { toAsyncIterable } from "../../../../toAsyncIterable.ts";
import type { SubscriptionResolvers } from "./../../../types.generated.js";
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

		return toAsyncIterable(
			ctx.fromGameEvents(gameId).pipe(
				filter((event) => event.type === "taskForce:appeared"),
				filter((event) => event.userId === ctx.userId),
				map((event) => ({
					type: "appear" as const,
					subject: {
						__typename: "TaskForce",
						id: event.id,
						position: event.position,
					},
				})),
				startWith(
					...initialTfs.map((tf) => ({
						type: "appear" as const,
						subject: {
							__typename: "TaskForce",
							id: tf.id,
							position: tf.position,
						},
					})),
				),
				mergeMap((appeared) =>
					concat(
						from([appeared]),
						ctx.fromGameEvents(gameId).pipe(
							filter((event) => event.type === "taskForce:position"),
							filter((event) => event.id === appeared.subject.id),
							map((event) => ({
								type: "update" as const,
								subject: {
									__typename: "TaskForce",
									id: event.id,
									position: event.position,
								},
							})),
							takeUntil(
								ctx.fromGameEvents(gameId).pipe(
									filter((event) => event.type === "taskForce:disappeared"),
									filter((event) => event.userId === ctx.userId),
									filter((event) => event.id === appeared.subject.id),
								),
							),
						),
						from([
							{
								type: "disappear" as const,
								subject: {
									__typename: "TaskForce",
									id: appeared.subject.id,
									// TODO: this should be the last known position
									position: appeared.subject.position,
								},
							},
						]),
					),
				),
			),
		);
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
