import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { type AnyRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "urql";
import { theme } from "./theme";
import { client } from "./urql";

export function App({ router }: { router: AnyRouter }) {
	return (
		<Provider value={client}>
			<MantineProvider theme={theme} defaultColorScheme="dark">
				<RouterProvider router={router} />
			</MantineProvider>
		</Provider>
	);
}
