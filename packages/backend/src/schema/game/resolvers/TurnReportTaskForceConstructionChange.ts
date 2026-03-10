import { eq, starSystems, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { TurnReportTaskForceConstructionChangeResolvers } from "./../../types.generated.ts";

export const TurnReportTaskForceConstructionChange: TurnReportTaskForceConstructionChangeResolvers =
	{
		completed: async (parent, _arg, _ctx) => {
			return parent.completed;
		},
		newDone: async (parent, _arg, _ctx) => {
			return parent.newDone;
		},
		perTick: async (parent, _arg, _ctx) => {
			return parent.perTick;
		},
		previousDone: async (parent, _arg, _ctx) => {
			return parent.previousDone;
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
		taskForce: async (parent, _arg, ctx) => {
			const taskForce = await ctx.drizzle.query.taskForces.findFirst({
				where: eq(taskForces.id, parent.taskForceId),
			});

			if (!taskForce) {
				throw createGraphQLError("Task force not found");
			}

			return {
				...taskForce,
				isVisible: true,
				lastUpdate: null,
			};
		},
		total: async (parent, _arg, _ctx) => {
			return parent.total;
		},
	};
