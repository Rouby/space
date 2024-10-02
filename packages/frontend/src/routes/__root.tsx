import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy } from "react";

const TanStackRouterDevtools = import.meta.env.PROD
	? () => null
	: lazy(() =>
			import("@tanstack/router-devtools").then((res) => ({
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
