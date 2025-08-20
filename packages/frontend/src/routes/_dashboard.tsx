import { Container } from "@mantine/core";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../features/Header/Header";
import { Footer } from "../features/Landing/Footer";

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

			<Footer />
		</>
	);
}
