import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { ShipDesigner } from "../../../features/ShipDesigns/ShipDesigner";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/ship-designs/new",
)({
	component: () => <Details />,
});

function Details() {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="60%" onClose={() => navigate({ to: ".." })}>
				<ShipDesigner gameId={id} onCreate={() => navigate({ to: ".." })} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
