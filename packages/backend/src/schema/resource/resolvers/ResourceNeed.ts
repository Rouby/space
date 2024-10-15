import { eq, resources } from "@space/data/schema";
import type { ResourceNeedResolvers } from "./../../types.generated.js";
export const ResourceNeed: ResourceNeedResolvers = {
	/* Implement ResourceNeed resolver logic here */
	alotted: ({ alotted }, _arg, _ctx) => {
		/* ResourceNeed.alotted resolver is required because ResourceNeed.alotted and ResourceNeedMapper.alotted are not compatible */
		return +alotted;
	},
	needed: ({ needed }, _arg, _ctx) => {
		/* ResourceNeed.needed resolver is required because ResourceNeed.needed and ResourceNeedMapper.needed are not compatible */
		return +needed;
	},
	resource: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(resources)
			.where(eq(resources.id, parent.resourceId))
			.then((res) => res[0]);
	},
};
