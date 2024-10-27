import {
	and,
	eq,
	exists,
	resources,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";
import type { PlayerResolvers } from "./../../types.generated.js";
export const Player: Pick<PlayerResolvers, "resources" | "__isTypeOf"> = {
	/* Implement Player resolver logic here */
	resources: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(resources)
			.where(
				and(
					eq(resources.gameId, parent.gameId),
					exists(
						ctx.drizzle
							.select({ id: starSystemResourceDiscoveries.resourceId })
							.from(starSystemResourceDiscoveries)
							.innerJoin(
								starSystems,
								eq(starSystems.id, starSystemResourceDiscoveries.starSystemId),
							)
							.where(
								and(
									eq(starSystemResourceDiscoveries.resourceId, resources.id),
									eq(starSystems.ownerId, parent.userId),
								),
							),
					),
				),
			);
	},
};
