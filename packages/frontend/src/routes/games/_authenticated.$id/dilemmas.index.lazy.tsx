import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { DilemmasList } from "../../../features/DilemmasList/DilemmasList";

export const Route = createLazyFileRoute("/games/_authenticated/$id/dilemmas/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const navigate = Route.useNavigate();

	return (
		<>
			<DetailsDrawer size="70%" onClose={() => navigate({ to: ".." })}>
				<DilemmasList />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
