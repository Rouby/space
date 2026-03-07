import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsModal } from "../../../components/DetailsModal/DetailsModal";
import { DilemmaChoice } from "../../../features/DilemmaChoice/DilemmaChoice";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/dilemmas/$dilemmaId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { dilemmaId } = Route.useParams();
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
					onChoosen={() =>
						navigate({
							to: "../..",
						})
					}
				/>
			</DetailsModal>

			<Outlet />
		</>
	);
}
