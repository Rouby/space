import {
	shipComponents,
	shipDesignComponents,
	shipDesigns,
} from "@space/data/schema";
import { inArray } from "drizzle-orm";
import { GraphQLError } from "graphql";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";

export const createShipDesign: NonNullable<
	MutationResolvers["createShipDesign"]
> = async (_parent, { gameId, design }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	return ctx.drizzle.transaction(async (tx) => {
		if (!design.components || design.components.length === 0) {
			throw new GraphQLError("Ship design must have at least one component");
		}

		// Calculate total stats
		const components = await tx.query.shipComponents.findMany({
			where: inArray(
				shipComponents.id,
				design.components.map((c) => c.componentId),
			),
		});

		const componentMap = new Map(components.map((c) => [c.id, c]));

		let totalPowerGeneration = 0;
		let totalPowerNeed = 0;
		let totalCrewCapacity = 0;
		let totalCrewNeed = 0;
		let hasDrive = false;

		for (const shipComponent of design.components) {
			const c = componentMap.get(shipComponent.componentId);
			if (!c)
				throw new GraphQLError(
					`Component not found: ${shipComponent.componentId}`,
				);

			totalPowerGeneration += Number(c.powerGeneration ?? 0);
			totalPowerNeed += Number(c.powerNeed ?? 0);
			totalCrewCapacity += Number(c.crewCapacity ?? 0);
			totalCrewNeed += Number(c.crewNeed ?? 0);

			if (
				(c.thruster !== null && Number(c.thruster) > 0) ||
				(c.ftlSpeed !== null && Number(c.ftlSpeed) > 0)
			) {
				hasDrive = true;
			}
		}

		if (totalCrewCapacity === 0) {
			throw new GraphQLError("Ship design must have crew quarters");
		}
		if (totalCrewCapacity < totalCrewNeed) {
			throw new GraphQLError(
				"Ship design must have enough crew capacity to operate all components",
			);
		}
		if (totalPowerGeneration === 0) {
			throw new GraphQLError("Ship design must have a power generator");
		}
		if (totalPowerGeneration < totalPowerNeed) {
			throw new GraphQLError(
				"Ship design must generate enough power to operate all components",
			);
		}
		if (!hasDrive) {
			throw new GraphQLError("Ship design must have a drive component");
		}

		const [shipDesign] = await tx
			.insert(shipDesigns)
			.values({
				gameId,
				ownerId: ctx.userId as string,
				name: design.name,
				description: design.description,
			})
			.returning();

		for (const shipComponent of design.components) {
			await tx.insert(shipDesignComponents).values({
				shipDesignId: shipDesign.id,
				shipComponentId: shipComponent.componentId,
			});
		}

		return shipDesign;
	});
};
