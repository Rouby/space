import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { StarSystemDetails } from "../../../features/Details/StarSystemDetails";
import { DetailsDrawer } from "../../../features/DetailsDrawer/DetailsDrawer";

export const Route = createLazyFileRoute(
	"/games/$id/star-system/$starSystemId",
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
