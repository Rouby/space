import { createFileRoute } from "@tanstack/react-router";
import { Features } from "../../features/Landing/Features";
import { Hero } from "../../features/Landing/Hero";

export const Route = createFileRoute("/_dashboard/")({
	component: () => (
		<>
			<Hero />

			<Features />
		</>
	),
});
