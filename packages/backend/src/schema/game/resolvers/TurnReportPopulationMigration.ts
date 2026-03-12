import { eq, starSystems, users } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TurnReportPopulationMigrationResolvers } from "./../../types.generated.ts";

export const TurnReportPopulationMigration: TurnReportPopulationMigrationResolvers =
	{
		sourceStarSystem: async (parent, _arg, ctx) => {
			const starSystem = await ctx.drizzle.query.starSystems.findFirst({
				where: eq(starSystems.id, parent.sourceStarSystemId),
			});

			if (!starSystem) {
				throw createGraphQLError("Source star system not found");
			}

			return {
				...starSystem,
				isVisible: true,
				lastUpdate: null,
			};
		},
		destinationStarSystem: async (parent, _arg, ctx) => {
			const starSystem = await ctx.drizzle.query.starSystems.findFirst({
				where: eq(starSystems.id, parent.destinationStarSystemId),
			});

			if (!starSystem) {
				throw createGraphQLError("Destination star system not found");
			}

			return {
				...starSystem,
				isVisible: true,
				lastUpdate: null,
			};
		},
		allegiancePlayer: async (parent, _arg, ctx) => {
			const player = await ctx.drizzle.query.users.findFirst({
				where: eq(users.id, parent.allegianceToPlayerId),
			});

			if (!player) {
				throw createGraphQLError("Migration allegiance player not found");
			}

			return player;
		},
		amount: async (parent) => {
			return BigInt(parent.amount);
		},
	};
