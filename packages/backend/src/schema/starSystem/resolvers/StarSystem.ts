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
	| "name"
	| "owner"
	| "position"
	| "resourceDepots"
	| "sensorRange"
	| "__isTypeOf"
> = {
	id: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.id;
	},
	name: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.name;
	},
	position: async (_parent, _arg, _ctx) => {
		// typegeneration bugged?
		return _parent.position;
	},
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
	sensorRange: async (_parent, _arg, _ctx) => {
		return 1000;
	},
	discoveries: async (parent, _arg, ctx) => {
		const resourceDiscoveries = await ctx.drizzle
			.select()
			.from(starSystemResourceDiscoveries)
			.where(eq(starSystemResourceDiscoveries.starSystemId, parent.id));

		return [
			...resourceDiscoveries.map((d) => ({
				__typename: "ResourceDiscovery" as const,
				...d,
			})),
		].sort((d1, d2) => d1.discoveredAt.getTime() - d2.discoveredAt.getTime());
	},
	resourceDepots: async (parent, _arg, ctx) => {
		const resourceDepots = await ctx.drizzle
			.select()
			.from(starSystemResourceDepots)
			.where(eq(starSystemResourceDepots.starSystemId, parent.id));

		return resourceDepots;
	},
};
