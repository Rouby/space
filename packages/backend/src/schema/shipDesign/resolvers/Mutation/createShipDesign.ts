import { shipDesignComponents, shipDesigns } from "@space/data/schema";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createShipDesign: NonNullable<
	MutationResolvers["createShipDesign"]
> = async (_parent, { gameId, design }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle.transaction(async (tx) => {
		const [shipDesign] = await tx
			.insert(shipDesigns)
			.values({
				gameId,
				ownerId: ctx.userId as string,
				name: design.name,
				description: design.description,
			})
			.returning();

		for (const [position, shipComponentId] of design.componentIds.entries()) {
			await tx.insert(shipDesignComponents).values({
				shipDesignId: shipDesign.id,
				shipComponentId,
				position,
			});
		}

		return shipDesign;
	});
};
