import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
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
			<DetailsDrawer
				size="70%"
				onClose={() =>
					navigate({
						from: "/games/$id/ship-designs",
						to: "..",
					})
				}
			>
				<ShipDesigns />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
