import { eq, starSystems } from "@space/data/schema";
import type { TurnReportIndustryChangeResolvers } from "./../../types.generated.ts";

export const TurnReportIndustryChange: TurnReportIndustryChangeResolvers = {
	industryTotal: async (parent, _arg, _ctx) => {
		return parent.industryTotal;
	},
	industryUtilized: async (parent, _arg, _ctx) => {
		return parent.industryUtilized;
	},
	starSystem: async (parent, _arg, ctx) => {
		const starSystemResult = await ctx.drizzle.query.starSystems.findFirst({
			where: eq(starSystems.id, parent.starSystemId),
		});
		if (!starSystemResult) {
			throw new Error("Star system not found");
		}
		return { ...starSystemResult, isVisible: true, lastUpdate: null };
	},
};
