import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { TurnReportsDetails } from "../../../features/TurnReportsDetails/TurnReportsDetails";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/turn-reports",
)({
	component: () => <Details />,
});

function Details() {
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="70%" onClose={() => navigate({ to: ".." })}>
				<TurnReportsDetails />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
