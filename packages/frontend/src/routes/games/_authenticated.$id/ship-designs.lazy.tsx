import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { ShipDesigns } from "../../../features/ShipDesigns/ShipDesigns";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/ship-designs",
)({
	component: () => <Details />,
});

function Details() {
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="70%" onClose={() => navigate({ to: ".." })}>
				<ShipDesigns />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
