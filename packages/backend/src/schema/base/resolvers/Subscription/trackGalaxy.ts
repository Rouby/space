import {
	and,
	eq,
	exists,
	sql,
	starSystems,
	taskForces,
	visibility,
} from "@space/data/schema";
import { merge } from "rxjs";
import { starSystems$ } from "../../../../observables/starSystems.ts";
import { taskForces$ } from "../../../../observables/taskForces.ts";
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

		const taskForceEvents = taskForces$({
			gameId,
			userId: ctx.userId ?? "",
			initialTaskForces: initialTfs,
		});

		const starSystemEvents = starSystems$({
			gameId,
			userId: ctx.userId ?? "",
			initialStarSystems: initialSSs,
		});

		return toAsyncIterable(merge(taskForceEvents, starSystemEvents));
	},
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	resolve: (input: any) => input,
};
