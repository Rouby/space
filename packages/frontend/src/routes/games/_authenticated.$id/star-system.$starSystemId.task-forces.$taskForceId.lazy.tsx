import { Title } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { DeckConfigurationPanel } from "../../../features/StarSystemDetails/DeckConfigurationPanel";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/task-forces/$taskForceId",
)({
	component: DeckConfigurationRoute,
});

function DeckConfigurationRoute() {
	const navigate = Route.useNavigate();
	const { id, starSystemId, taskForceId } = Route.useParams();

	return (
		<DetailsDrawer
			size="50%"
			onClose={() => navigate({ to: "..", params: { id, starSystemId } })}
		>
			<Title order={3} mb="md">
				Deck Configuration
			</Title>
			<DeckConfigurationPanel id={starSystemId} taskForceId={taskForceId} />
		</DetailsDrawer>
	);
}
