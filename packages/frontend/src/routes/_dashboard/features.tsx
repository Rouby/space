import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/features")({
	component: () => <div>Hello /_dashboard/features!</div>,
});
