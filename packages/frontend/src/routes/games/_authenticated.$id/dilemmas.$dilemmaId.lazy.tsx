import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsModal } from "../../../components/DetailsModal/DetailsModal";
import { DilemmaChoice } from "../../../features/DilemmaChoice/DilemmaChoice";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/dilemmas/$dilemmaId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { dilemmaId, id: gameId } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsModal
				onClose={() => navigate({ to: "../.." })}
				title="Dilemma"
				size="xl"
			>
				<DilemmaChoice
					id={dilemmaId}
					gameId={gameId}
					onChoosen={(nextDilemmaId) => {
						if (nextDilemmaId) {
							navigate({
								to: ".",
								params: {
									id: gameId,
									dilemmaId: nextDilemmaId,
								},
							});
						} else {
							navigate({
								to: "../..",
							});
						}
					}}
				/>
			</DetailsModal>

			<Outlet />
		</>
	);
}
