import { createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { ResearchPanel } from "../../../features/ResearchPanel/ResearchPanel";

export const Route = createLazyFileRoute("/games/_authenticated/$id/research")({
	component: () => <Details />,
});

function Details() {
	const navigate = Route.useNavigate();

	return (
		<DetailsDrawer size="70%" onClose={() => navigate({ to: ".." })}>
			<ResearchPanel />
		</DetailsDrawer>
	);
}
