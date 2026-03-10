import { createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { IndustrialProjectsPanel } from "../../../features/StarSystemDetails/IndustrialProjectsPanel";
import { Title } from "@mantine/core";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/industrial-projects",
)({
	component: IndustrialProjectsRoute,
});

function IndustrialProjectsRoute() {
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
				Industrial Projects
			</Title>
			<IndustrialProjectsPanel id={starSystemId} gameId={id} />
		</DetailsDrawer>
	);
}
