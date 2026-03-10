import { createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { CommissionTaskForcePanel } from "../../../features/StarSystemDetails/CommissionTaskForcePanel";
import { Title } from "@mantine/core";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/commission-task-force",
)({
	component: CommissionTaskForceRoute,
});

function CommissionTaskForceRoute() {
	const navigate = Route.useNavigate();
	const { id, starSystemId } = Route.useParams();

	return (
		<DetailsDrawer
			size="60%"
			onClose={() =>
				navigate({
					to: "/games/$id/star-system/$starSystemId",
					params: { id, starSystemId },
				})
			}
		>
			<Title order={3} mb="md">
				Commission Task Force
			</Title>
			<CommissionTaskForcePanel id={starSystemId} gameId={id} />
		</DetailsDrawer>
	);
}
