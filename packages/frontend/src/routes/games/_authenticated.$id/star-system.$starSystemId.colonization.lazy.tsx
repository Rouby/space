import { Title } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { ColonizationManagementPanel } from "../../../features/StarSystemDetails/ColonizationManagementPanel";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/colonization",
)({
	component: ColonizationManagementRoute,
});

function ColonizationManagementRoute() {
	const navigate = Route.useNavigate();
	const { id, starSystemId } = Route.useParams();

	return (
		<DetailsDrawer
			size="60%"
			onClose={() => navigate({ to: "..", params: { id, starSystemId } })}
		>
			<Title order={3} mb="md">
				Colonization Management
			</Title>
			<ColonizationManagementPanel id={starSystemId} gameId={id} />
		</DetailsDrawer>
	);
}
