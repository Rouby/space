import { createFileRoute } from "@tanstack/react-router";
import { FeaturesPage } from "../../features/FeaturesPage/FeaturesPage";

export const Route = createFileRoute("/_dashboard/features")({
	component: FeaturesPage,
});
