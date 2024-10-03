import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { GameLobby } from "../../../features/GameLobby/GameLobby";

export const Route = createFileRoute(
	"/_dashboard/_authenticated/games/lobby/$id",
)({
	component: () => (
		<Suspense>
			<GameLobby />
		</Suspense>
	),
});
