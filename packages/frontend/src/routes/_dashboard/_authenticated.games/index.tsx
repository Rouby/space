import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CreateGame } from "../../../features/CreateGame/CreateGame";
import { GamesList } from "../../../features/GamesList/GamesList";

export const Route = createFileRoute("/_dashboard/_authenticated/games/")({
	component: () => <GamesPage />,
});

function GamesPage() {
	return (
		<div>
			<CreateGame />
			<Suspense fallback="loading...">
				<GamesList />
			</Suspense>
		</div>
	);
}
