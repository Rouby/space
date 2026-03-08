import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { StarSystemDetails } from "../../../features/StarSystemDetails/StarSystemDetails";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId",
)({
	component: () => <Details />,
});

function Details() {
	const { id, starSystemId } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="70%" onClose={() => navigate({ to: "../.." })}>
				<StarSystemDetails id={starSystemId} gameId={id} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
