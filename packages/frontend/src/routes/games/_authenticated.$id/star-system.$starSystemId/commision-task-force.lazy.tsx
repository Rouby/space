import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DetailsDrawer } from "../../../../components/DetailsDrawer/DetailsDrawer";
import { CommisionTaskForce } from "../../../../features/StarSystemDetails/CommisionTaskForce";

export const Route = createLazyFileRoute(
	"/games/_authenticated/$id/star-system/$starSystemId/commision-task-force",
)({
	component: () => <Details />,
});

function Details() {
	const { id, starSystemId } = Route.useParams();

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
				<CommisionTaskForce
					starSystemId={starSystemId}
					gameId={id}
					onCommision={() => navigate({ to: ".." })}
				/>
			</DetailsDrawer>

			<Outlet />
		</>
	);
}
