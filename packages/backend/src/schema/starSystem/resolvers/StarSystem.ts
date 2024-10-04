import { eq, users } from "@space/data/schema";
import type { StarSystemResolvers } from "./../../types.generated.js";
export const StarSystem: Pick<
	StarSystemResolvers,
	"id" | "name" | "owner" | "position" | "__isTypeOf"
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

		const owner = await ctx.drizzle.query.users.findFirst({
			where: eq(users.id, parent.ownerId),
		});

		if (!owner) {
			return null;
		}

		return owner;
	},
};
