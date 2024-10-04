import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CommisionTaskForce } from "../../../../features/Details/CommisionTaskForce";
import { DetailsDrawer } from "../../../../features/DetailsDrawer/DetailsDrawer";

export const Route = createLazyFileRoute(
	"/games/$id/star-system/$starSystemId/commision-task-force",
)({
	component: () => <Details />,
});

function Details() {
	const { starSystemId } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer
				size="60%"
				onClose={() =>
					navigate({
						from: "/games/$id/star-system/$starSystemId/commision-task-force",
						to: "..",
					})
				}
			>
				<CommisionTaskForce starSystemId={starSystemId} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
