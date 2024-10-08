import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/games/_authenticated")({
	beforeLoad: async ({ context }) => {
		if (!context.me) {
			throw redirect({
				to: "/signin",
				search: {
					redirect: location.pathname,
				},
			});
		}
	},
});
