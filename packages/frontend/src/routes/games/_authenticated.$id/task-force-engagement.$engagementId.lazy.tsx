import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { TaskForceEngagementDetails } from "../../../features/TaskForceEngagementDetails/TaskForceEngagementDetails";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/task-force-engagement/$engagementId",
)({
	component: () => <Details />,
});

function Details() {
	const { engagementId } = Route.useParams();
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
				<TaskForceEngagementDetails id={engagementId} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
