import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "urql";
import { router } from "./router";
import { theme } from "./theme";
import { client } from "./urql";

export function App() {
	return (
		<Provider value={client}>
			<MantineProvider theme={theme} defaultColorScheme="dark">
				<RouterProvider router={router} />
			</MantineProvider>
		</Provider>
	);
}
