import {
	and,
	eq,
	isNotNull,
	lt,
	notInArray,
	resources,
	sql,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickDiscoveries(tx: Transaction, ctx: Context) {
	const starSystemsWithDiscoveries = await tx
		.select({
			id: starSystems.id,
			discoveryProgress: starSystems.discoveryProgress,
			discoveriesMade: sql`count(${starSystemResourceDiscoveries.resourceId})`
				.mapWith(Number)
				.as("discoveriesMade"),
			discoveries: sql<
				{ resourceId: string }[]
			>`json_agg(json_build_object('resourceId', ${starSystemResourceDiscoveries.resourceId}))`,
		})
		.from(starSystems)
		.where(
			and(
				eq(starSystems.gameId, gameId),
				isNotNull(starSystems.ownerId),
				lt(
					tx
						.select({ count: sql`count(*)` })
						.from(starSystemResourceDiscoveries)
						.where(
							eq(starSystemResourceDiscoveries.starSystemId, starSystems.id),
						),
					starSystems.discoverySlots,
				),
			),
		)
		.leftJoin(
			starSystemResourceDiscoveries,
			eq(starSystemResourceDiscoveries.starSystemId, starSystems.id),
		)
		.groupBy(starSystems.id);

	for (let {
		id,
		discoveries,
		discoveryProgress,
	} of starSystemsWithDiscoveries) {
		const discoveryProgressChange = 0.00002777778;
		if (+discoveryProgress >= 1) {
			const [resource] = await tx
				.select()
				.from(resources)
				.where(
					and(
						eq(resources.gameId, gameId),
						notInArray(
							resources.id,
							discoveries.map((d) => d.resourceId).filter(Boolean),
						),
					),
				)
				.orderBy(sql`random()`)
				.limit(1);

			await tx.insert(starSystemResourceDiscoveries).values({
				starSystemId: id,
				resourceId: resource.id,
				discoveredAt: new Date(),
				remainingDeposits: "100000",
			});

			[{ discoveryProgress }] = await tx
				.update(starSystems)
				.set({
					discoveryProgress: sql`${starSystems.discoveryProgress} % 1::numeric`,
				})
				.where(eq(starSystems.id, id))
				.returning();
		} else {
			[{ discoveryProgress }] = await tx
				.update(starSystems)
				.set({
					discoveryProgress: sql`${starSystems.discoveryProgress} + ${discoveryProgressChange}::numeric`,
				})
				.where(eq(starSystems.id, id))
				.returning();
		}
		ctx.postMessage({
			type: "starSystem:discoveryProgress",
			id,
			discoveryProgress: +discoveryProgress,
			discoveryProgressChange,
		});
	}
}
