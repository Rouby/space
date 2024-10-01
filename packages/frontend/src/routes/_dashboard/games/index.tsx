import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { GamesList } from "../../../features/GamesList/GamesList";

export const Route = createFileRoute("/_dashboard/games/")({
	component: () => (
		<div>
			<Suspense fallback="loading...">
				<GamesList />
			</Suspense>
		</div>
	),
});
