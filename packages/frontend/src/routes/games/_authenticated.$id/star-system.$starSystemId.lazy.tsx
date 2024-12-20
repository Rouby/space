import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { StarSystemDetails } from "../../../features/StarSystemDetails/StarSystemDetails";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId",
)({
	component: () => <Details />,
});

function Details() {
	const { starSystemId } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer
				size="70%"
				onClose={() =>
					navigate({
						from: "/games/$id/star-system/$starSystemId",
						to: "../..",
					})
				}
			>
				<StarSystemDetails id={starSystemId} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
