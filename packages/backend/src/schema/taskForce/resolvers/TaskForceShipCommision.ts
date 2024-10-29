import {
	eq,
	shipDesigns,
	taskForceShipCommisionResourceNeeds,
} from "@space/data/schema";
import type { TaskForceShipCommisionResolvers } from "./../../types.generated.js";
export const TaskForceShipCommision: TaskForceShipCommisionResolvers = {
	/* Implement TaskForceShipCommision resolver logic here */
	resourceNeeds: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(taskForceShipCommisionResourceNeeds)
			.where(
				eq(
					taskForceShipCommisionResourceNeeds.taskForceShipCommisionId,
					parent.id,
				),
			);
	},
	shipDesign: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipDesigns)
			.where(eq(shipDesigns.id, parent.shipDesignId))
			.then((results) => results[0]);
	},
	constructionDone: ({ constructionDone }, _arg, _ctx) => {
		/* TaskForceShipCommision.constructionDone resolver is required because TaskForceShipCommision.constructionDone and TaskForceShipCommisionMapper.constructionDone are not compatible */
		return +constructionDone;
	},
	constructionTotal: ({ constructionTotal }, _arg, _ctx) => {
		/* TaskForceShipCommision.constructionTotal resolver is required because TaskForceShipCommision.constructionTotal and TaskForceShipCommisionMapper.constructionTotal are not compatible */
		return +constructionTotal;
	},
};
