import { rem } from "@mantine/core";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { useStyles } from "tss-react";
import { GalaxyView } from "../../features/GalaxyView/GalaxyView";
import { InGameMenu } from "../../features/InGameMenu/InGameMenu";
import { mq } from "../../theme";

export const Route = createLazyFileRoute("/games/_authenticated/$id")({
	component: () => <IngameLayout />,
});

function IngameLayout() {
	const { css } = useStyles();

	return (
		<div
			className={css({
				height: "100vh",
				display: "grid",
				gridTemplateColumns: `${rem(300)} 1fr`,
				[mq.md]: {
					gridTemplateColumns: "1fr",
				},
				overflow: "hidden",
			})}
		>
			<InGameMenu />

			<main className={css({ display: "grid", position: "relative" })}>
				<GalaxyView />

				<Outlet />
			</main>
		</div>
	);
}
