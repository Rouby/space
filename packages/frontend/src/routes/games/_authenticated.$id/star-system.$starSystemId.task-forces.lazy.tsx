import { Title } from "@mantine/core";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../components/DetailsDrawer/DetailsDrawer";
import { TaskForcesPanel } from "../../../features/StarSystemDetails/TaskForcesPanel";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/task-forces",
)({
	component: TaskForcesRoute,
});

function TaskForcesRoute() {
	const navigate = Route.useNavigate();
	const { id, starSystemId } = Route.useParams();

	return (
		<>
			<DetailsDrawer
				size="60%"
				onClose={() => navigate({ to: "..", params: { id, starSystemId } })}
			>
				<Title order={3} mb="md">
					Task Forces
				</Title>
				<TaskForcesPanel id={starSystemId} gameId={id} />
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
