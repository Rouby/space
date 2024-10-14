import {
	and,
	eq,
	shipDesignResourceCosts,
	shipDesigns,
	sql,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createShipDesign: NonNullable<
	MutationResolvers["createShipDesign"]
> = async (_parent, { gameId, design }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const supplyNeed =
		design.hullRating +
		design.shieldRating +
		design.armorRating +
		design.weaponRating +
		design.speedRating +
		design.zoneOfControlRating;

	const resourceCosts =
		100 * design.hullRating +
		10 * design.shieldRating +
		10 * design.armorRating +
		10 * design.weaponRating +
		10 * design.speedRating +
		50 * design.zoneOfControlRating +
		25 * design.supplyCapacity;

	const resourceId = await ctx.drizzle
		.select({ id: starSystemResourceDiscoveries.resourceId })
		.from(starSystemResourceDiscoveries)
		.innerJoin(
			starSystems,
			and(
				eq(starSystemResourceDiscoveries.starSystemId, starSystems.id),
				eq(starSystems.gameId, gameId),
				eq(starSystems.ownerId, ctx.userId as string),
			),
		)
		.orderBy(sql`random()`)
		.limit(1)
		.then((rows) => rows[0].id);

	return ctx.drizzle.transaction(async (tx) => {
		const [shipDesign] = await tx
			.insert(shipDesigns)
			.values({
				gameId,
				ownerId: ctx.userId as string,
				...design,
				supplyNeed,
			})
			.returning();

		await tx.insert(shipDesignResourceCosts).values({
			shipDesignId: shipDesign.id,
			resourceId,
			quantity: resourceCosts,
		});

		return shipDesign;
	});
};
