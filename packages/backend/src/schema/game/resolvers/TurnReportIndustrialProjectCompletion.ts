import { eq, starSystems } from "@space/data/schema";
import type { TurnReportIndustrialProjectCompletionResolvers } from "./../../types.generated.ts";

export const TurnReportIndustrialProjectCompletion: TurnReportIndustrialProjectCompletionResolvers =
	{
		industryBonus: async (parent, _arg, _ctx) => {
			return parent.industryBonus;
		},
		projectType: async (parent, _arg, _ctx) => {
			if (
				parent.projectType !== "factory_expansion" &&
				parent.projectType !== "automation_hub" &&
				parent.projectType !== "orbital_foundry"
			) {
				throw new Error("Invalid industrial project type in turn report");
			}

			return parent.projectType;
		},
		starSystem: async (parent, _arg, ctx) => {
			const starSystem = await ctx.drizzle.query.starSystems.findFirst({
				where: eq(starSystems.id, parent.starSystemId),
			});

			if (!starSystem) {
				throw new Error("Star system not found");
			}

			return {
				...starSystem,
				isVisible: true,
				lastUpdate: null,
			};
		},
	};
