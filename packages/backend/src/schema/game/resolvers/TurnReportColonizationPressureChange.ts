import { eq, starSystems } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TurnReportColonizationPressureChangeResolvers } from "./../../types.generated.ts";

export const TurnReportColonizationPressureChange: TurnReportColonizationPressureChangeResolvers =
	{
		pressureAdded: (parent) => parent.pressureAdded,
		accumulatedPressure: (parent) => parent.accumulatedPressure,
		pressureThreshold: (parent) => parent.pressureThreshold,
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
