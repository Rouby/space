import {
	and,
	eq,
	players,
	starSystemResourceDepots,
	starSystemResourceDiscoveries,
} from "@space/data/schema";
import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: Pick<
	StarSystemResolvers,
	| "discoveries"
	| "id"
	| "isVisible"
	| "lastUpdate"
	| "name"
	| "owner"
	| "position"
	| "resourceDepots"
	| "sensorRange"
	| "__isTypeOf"
> = {
	owner: async (parent, _arg, ctx) => {
		if (!parent.ownerId) {
			return null;
		}

		const owner = await ctx.drizzle.query.players.findFirst({
			where: and(
				eq(players.userId, parent.ownerId),
				eq(players.gameId, parent.gameId),
			),
			with: { user: true },
		});

		if (!owner) {
			return null;
		}

		return owner;
	},
	sensorRange: async (parent, _arg, _ctx) => {
		return parent.ownerId ? 1000 : null;
	},
	discoveries: async (parent, _arg, ctx) => {
		if (parent.discoverySlots === null) {
			return null;
		}

		const resourceDiscoveries = await ctx.drizzle
			.select()
			.from(starSystemResourceDiscoveries)
			.where(eq(starSystemResourceDiscoveries.starSystemId, parent.id));

		return [
			...resourceDiscoveries.map((d) => ({
				__typename: "ResourceDiscovery" as const,
				...d,
			})),
			...Array.from({ length: parent.discoverySlots }, (_, idx) => ({
				__typename: "UnknownDiscovery" as const,
				id: `${parent.id}-unknown-${idx}`,
				discoveredAt: new Date(),
			})),
		]
			.slice(0, parent.discoverySlots)
			.sort((d1, d2) => d1.discoveredAt.getTime() - d2.discoveredAt.getTime());
	},
	resourceDepots: async (parent, _arg, ctx) => {
		const resourceDepots = await ctx.drizzle
			.select()
			.from(starSystemResourceDepots)
			.where(eq(starSystemResourceDepots.starSystemId, parent.id));

		return resourceDepots;
	},
};
