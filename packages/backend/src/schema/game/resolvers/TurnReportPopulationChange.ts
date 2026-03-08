import { eq, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TurnReportPopulationChangeResolvers } from "./../../types.generated.ts";

export const TurnReportPopulationChange: TurnReportPopulationChangeResolvers = {
	growth: async (parent, _arg, _ctx) => {
		return BigInt(parent.growth);
	},
	newAmount: async (parent, _arg, _ctx) => {
		return BigInt(parent.newAmount);
	},
	population: async (parent, _arg, _ctx) => {
		const [starSystemId, allegianceToPlayerId] = parent.populationId.split(":");

		if (!starSystemId || !allegianceToPlayerId) {
			throw createGraphQLError("Invalid population identifier in turn report");
		}

		return {
			starSystemId,
			allegianceToPlayerId,
			amount: BigInt(parent.newAmount),
		};
	},
	previousAmount: async (parent, _arg, _ctx) => {
		return BigInt(parent.previousAmount);
	},
	starSystem: async (parent, _arg, ctx) => {
		const starSystem = await ctx.drizzle.query.starSystems.findFirst({
			where: eq(starSystems.id, parent.starSystemId),
		});

		if (!starSystem) {
			throw createGraphQLError("Star system not found");
		}

		return {
			...starSystem,
			isVisible: true,
			lastUpdate: null,
		};
	},
};
