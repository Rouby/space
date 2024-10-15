import {
	aliasedTable,
	and,
	eq,
	sql,
	starSystemResourceDepots,
	taskForceShipCommisionResourceNeeds,
	taskForceShipCommisions,
	taskForceShips,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

export async function tickTaskForceCommisions(tx: Transaction, ctx: Context) {
	const innerResourceNeeds = aliasedTable(
		taskForceShipCommisionResourceNeeds,
		"innerResourceNeeds",
	);

	const starSystemsWithCommisions = await tx
		.select({
			starSystemId: taskForceShipCommisions.starSystemId,
			commisions: sql<
				(typeof taskForceShipCommisions.$inferSelect)[]
			>`json_agg(${taskForceShipCommisions})`,
			resourceDepots: sql<
				{ resourceId: string; quantity: number }[]
			>`json_agg(DISTINCT jsonb_build_object('resourceId', ${starSystemResourceDepots.resourceId}, 'quantity', ${starSystemResourceDepots.quantity}))`,
			resourceNeeds: sql<
				(typeof taskForceShipCommisionResourceNeeds.$inferSelect)[]
			>`json_agg(${taskForceShipCommisionResourceNeeds})`,
		})
		.from(taskForceShipCommisions)
		.where(eq(taskForceShipCommisions.gameId, gameId))
		.innerJoin(
			innerResourceNeeds,
			eq(
				innerResourceNeeds.taskForceShipCommisionId,
				taskForceShipCommisions.id,
			),
		)
		.innerJoin(
			starSystemResourceDepots,
			and(
				eq(
					starSystemResourceDepots.starSystemId,
					taskForceShipCommisions.starSystemId,
				),
				eq(innerResourceNeeds.resourceId, starSystemResourceDepots.resourceId),
			),
		)
		.groupBy(taskForceShipCommisions.starSystemId)
		.innerJoin(
			taskForceShipCommisionResourceNeeds,
			eq(
				taskForceShipCommisionResourceNeeds.taskForceShipCommisionId,
				taskForceShipCommisions.id,
			),
		);

	for (const {
		starSystemId,
		commisions,
		resourceNeeds,
		resourceDepots,
	} of starSystemsWithCommisions) {
		const commisionsWithNeeds = commisions.map((commision) => ({
			commision,
			resourceNeeds: resourceNeeds.filter(
				(resourceNeed) =>
					resourceNeed.taskForceShipCommisionId === commision.id,
			),
		}));

		// allocate resources
		for (const { commision, resourceNeeds } of commisionsWithNeeds) {
			for (const resource of resourceNeeds) {
				const depot = resourceDepots.find(
					(depot) => depot.resourceId === resource.resourceId,
				);

				if (
					!depot ||
					depot.quantity <= 0 ||
					+resource.needed - +resource.alotted <= 0
				) {
					continue;
				}

				const allocated = Math.min(depot.quantity, +resource.needed);

				const [{ quantity }] = await tx
					.update(starSystemResourceDepots)
					.set({
						quantity: sql`${starSystemResourceDepots.quantity} - ${allocated}::numeric`,
					})
					.where(
						and(
							eq(starSystemResourceDepots.starSystemId, starSystemId),
							eq(starSystemResourceDepots.resourceId, resource.resourceId),
						),
					)
					.returning();

				const [{ alotted }] = await tx
					.update(taskForceShipCommisionResourceNeeds)
					.set({
						alotted: sql`${taskForceShipCommisionResourceNeeds.alotted} + ${allocated}::numeric`,
					})
					.where(
						and(
							eq(
								taskForceShipCommisionResourceNeeds.taskForceShipCommisionId,
								commision.id,
							),
							eq(
								taskForceShipCommisionResourceNeeds.resourceId,
								resource.resourceId,
							),
						),
					)
					.returning();

				depot.quantity = +quantity;
				resource.alotted = alotted;
			}
		}

		// spend resources
		let workCapacityLeft = 1;
		while (workCapacityLeft > 0) {
			const workableResourceNeed = resourceNeeds.find(
				(resourceNeed) => +resourceNeed.alotted > 0,
			);

			if (!workableResourceNeed) {
				break;
			}

			const workable = Math.min(+workableResourceNeed.alotted, 1);

			const [{ needed, alotted }] = await tx
				.update(taskForceShipCommisionResourceNeeds)
				.set({
					needed: sql`${taskForceShipCommisionResourceNeeds.needed} - ${workable}::numeric`,
					alotted: sql`${taskForceShipCommisionResourceNeeds.alotted} - ${workable}::numeric`,
				})
				.where(
					and(
						eq(
							taskForceShipCommisionResourceNeeds.taskForceShipCommisionId,
							workableResourceNeed.taskForceShipCommisionId,
						),
						eq(
							taskForceShipCommisionResourceNeeds.resourceId,
							workableResourceNeed.resourceId,
						),
					),
				)
				.returning();

			workCapacityLeft -= workable;
			workableResourceNeed.needed = needed;
			workableResourceNeed.alotted = alotted;
		}

		// finish ships
		for (const { commision, resourceNeeds } of commisionsWithNeeds) {
			if (resourceNeeds.some((resourceNeed) => +resourceNeed.needed > 0)) {
				continue;
			}

			const [shipCommision] = await tx
				.delete(taskForceShipCommisions)
				.where(eq(taskForceShipCommisions.id, commision.id))
				.returning();

			await tx.insert(taskForceShips).values({
				taskForceId: shipCommision.taskForceId,
				name: shipCommision.name,
				role: shipCommision.role,
				shipDesignId: shipCommision.shipDesignId,
			});
		}
	}
}
