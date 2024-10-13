import {
	and,
	eq,
	gt,
	isNotNull,
	sql,
	starSystemResourceDepots,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickStarSystemEconomy(tx: Transaction, ctx: Context) {
	const starSystemsWithResourcesLeft = await tx
		.select({
			id: starSystems.id,
			resources: sql<
				{ resourceId: string; remainingDeposits: number }[]
			>`json_agg(json_build_object('resourceId', ${starSystemResourceDiscoveries.resourceId}, 'remainingDeposits', ${starSystemResourceDiscoveries.remainingDeposits}))`,
			depots: sql<
				{ resourceId: string; quantity: number }[]
			>`json_agg(json_build_object('resourceId', ${starSystemResourceDepots.resourceId}, 'quantity', ${starSystemResourceDepots.quantity}))`,
		})
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.innerJoin(
			starSystemResourceDiscoveries,
			and(
				eq(starSystemResourceDiscoveries.starSystemId, starSystems.id),
				gt(starSystemResourceDiscoveries.remainingDeposits, "0"),
			),
		)
		.leftJoin(
			starSystemResourceDepots,
			and(
				eq(starSystemResourceDepots.starSystemId, starSystems.id),
				eq(
					starSystemResourceDepots.resourceId,
					starSystemResourceDiscoveries.resourceId,
				),
			),
		)
		.groupBy(starSystems.id);

	for (const starSystem of starSystemsWithResourcesLeft) {
		for (const discovery of starSystem.resources) {
			const miningRate = Math.min(0.01, discovery.remainingDeposits);

			const remainingDeposits = discovery.remainingDeposits - miningRate;

			const depot = starSystem.depots.find(
				(depot) => depot.resourceId === discovery.resourceId,
			);

			await tx
				.update(starSystemResourceDiscoveries)
				.set({
					remainingDeposits: sql`${remainingDeposits} - ${miningRate}::numeric`,
				})
				.where(
					and(
						eq(starSystemResourceDiscoveries.starSystemId, starSystem.id),
						eq(starSystemResourceDiscoveries.resourceId, discovery.resourceId),
					),
				);

			if (depot) {
				await tx
					.update(starSystemResourceDepots)
					.set({
						quantity: sql`${starSystemResourceDepots.quantity} + ${miningRate}::numeric`,
					})
					.where(
						and(
							eq(starSystemResourceDepots.starSystemId, starSystem.id),
							eq(starSystemResourceDepots.resourceId, discovery.resourceId),
						),
					);
			} else {
				await tx.insert(starSystemResourceDepots).values({
					starSystemId: starSystem.id,
					resourceId: discovery.resourceId,
					quantity: sql`0 + ${miningRate}::numeric`,
				});
			}
		}
	}
}
