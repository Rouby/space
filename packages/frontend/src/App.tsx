import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "urql";
import { AuthProvider, useAuth } from "./Auth";
import { router } from "./router";
import { theme } from "./theme";
import { client } from "./urql";

export function App() {
	return (
		<Provider value={client}>
			<AuthProvider>
				<MantineProvider theme={theme} defaultColorScheme="dark">
					<InnerApp />
				</MantineProvider>
			</AuthProvider>
		</Provider>
	);
}

function InnerApp() {
	const { me } = useAuth();

	return <RouterProvider router={router} context={{ me }} />;
}
