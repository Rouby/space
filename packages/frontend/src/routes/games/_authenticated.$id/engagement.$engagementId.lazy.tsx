import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { CombatEngagementPanel } from "../../../features/CombatEngagementPanel/CombatEngagementPanel";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/engagement/$engagementId",
)({
	component: () => <Details />,
});

function Details() {
	const { engagementId } = Route.useParams();
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="70%" onClose={() => navigate({ to: "../.." })}>
				<CombatEngagementPanel engagementId={engagementId} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
