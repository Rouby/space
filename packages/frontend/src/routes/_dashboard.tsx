import { Container } from "@mantine/core";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "../features/Header/Header";

export const Route = createFileRoute("/_dashboard")({
	component: () => <DashboardLayout />,
});

function DashboardLayout() {
	return (
		<>
			<Header />

			<Container>
				<Outlet />
			</Container>
		</>
	);
}
