import { industrialProjectCatalog } from "@space/data/functions";
import type { IndustrialProjectResolvers } from "./../../types.generated.js";

export const IndustrialProject: IndustrialProjectResolvers = {
	category: (parent) => {
		const definition =
			industrialProjectCatalog[
				parent.projectType as keyof typeof industrialProjectCatalog
			];
		return definition?.category ?? "industry";
	},
	description: (parent) => {
		const definition =
			industrialProjectCatalog[
				parent.projectType as keyof typeof industrialProjectCatalog
			];
		return definition?.description ?? "";
	},
};
