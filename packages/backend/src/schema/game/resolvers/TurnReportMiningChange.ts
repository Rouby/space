import type { TurnReportMiningChangeResolvers } from "./../../types.generated.ts";

export const TurnReportMiningChange: TurnReportMiningChangeResolvers = {
	depotQuantity: async (parent, _arg, _ctx) => {
		return parent.depotQuantity;
	},
	mined: async (parent, _arg, _ctx) => {
		return parent.mined;
	},
	remainingDeposits: async (parent, _arg, _ctx) => {
		return parent.remainingDeposits;
	},
	resourceId: async (parent, _arg, _ctx) => {
		return parent.resourceId;
	},
	starSystemId: async (parent, _arg, _ctx) => {
		return parent.starSystemId;
	},
};
