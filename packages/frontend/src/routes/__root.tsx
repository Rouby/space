import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const TanStackRouterDevtools = import.meta.env.PROD
	? () => null
	: lazy(() =>
			import("@tanstack/react-router-devtools").then((res) => ({
				default: res.TanStackRouterDevtools,
			})),
		);

interface MyRouterContext {
	me: { id: string } | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
			<Outlet />

			<TanStackRouterDevtools />
		</>
	),
});
