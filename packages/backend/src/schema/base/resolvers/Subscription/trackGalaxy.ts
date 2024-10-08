import {
	aliasedTable,
	and,
	eq,
	exists,
	or,
	sql,
	starSystems,
	taskForces,
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

		const controlledSystems = aliasedTable(starSystems, "controlledSystems");
		const controlledTaskForces = aliasedTable(
			taskForces,
			"controlledTaskForces",
		);

		const initialTfs = await ctx.drizzle
			.select()
			.from(taskForces)
			.where(
				and(
					eq(taskForces.gameId, gameId),
					or(
						// either the task force is owned by the player
						eq(taskForces.ownerId, ctx.userId ?? ""),
						// or the star system is close to a task force the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledTaskForces)
								.where(
									and(
										eq(controlledTaskForces.gameId, gameId),
										eq(controlledTaskForces.ownerId, ctx.userId ?? ""),
										sql`${controlledTaskForces.position} <-> ${taskForces.position} < 100`,
									),
								),
						),
						// or the task force is close to a star system the player controls
						exists(
							ctx.drizzle
								.select()
								.from(controlledSystems)
								.where(
									and(
										eq(controlledSystems.gameId, gameId),
										eq(controlledSystems.ownerId, ctx.userId ?? ""),
										sql`${controlledSystems.position} <-> ${taskForces.position} < 1000`,
									),
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
