import { Badge, rem } from "@mantine/core";
import { type Icon, IconLicense, IconView360 } from "@tabler/icons-react";
import {
	type LinkProps,
	Outlet,
	Link as RouterLink,
	createLazyFileRoute,
} from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { GalaxyView } from "../../features/GalaxyView/GalaxyView";
import { UserButton } from "../../features/UserButton/UserButton";
import { mq, theme } from "../../theme";

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
			<nav
				className={css({
					backgroundColor: theme.colors.body,
					padding: theme.spacing.md,
					paddingTop: 0,
					display: "flex",
					flexDirection: "column",
					borderRight: `${rem(1)} solid ${theme.colors.dark[4]}`,
					[mq.md]: {
						display: "none",
					},
				})}
			>
				<Section>
					<UserButton />
				</Section>

				<Section>
					<div className={css({})}>
						<Link to="/games/$id" icon={IconView360}>
							Overview
						</Link>

						<Link to="/games/$id/ship-designs" icon={IconLicense}>
							Ship Designs
						</Link>
					</div>
				</Section>
			</nav>

			<main className={css({ display: "grid", position: "relative" })}>
				<GalaxyView />

				<Outlet />
			</main>
		</div>
	);
}

function Section({ children }: { children: React.ReactNode }) {
	const { css } = useStyles();

	return (
		<div
			className={css({
				marginInline: `calc(${theme.spacing.md} * -1)`,
				marginBottom: theme.spacing.md,

				"&:not(:last-of-type)": {
					borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
				},
			})}
		>
			{children}
		</div>
	);
}

const Link = forwardRef<
	HTMLAnchorElement,
	LinkProps & { notificationCount?: number; icon: Icon; className?: string }
>(function Link({ notificationCount, icon: IconElement, ...props }, ref) {
	const { css, cx } = useStyles();

	return (
		<RouterLink
			ref={ref}
			{...props}
			className={cx(
				css({
					display: "flex",
					alignItems: "center",
					width: "100%",
					padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
					borderRadius: theme.radius.sm,
					fontSize: theme.fontSizes.sm,
					fontWeight: 500,
					color: theme.colors.dark[0],
					textDecoration: "none",

					"&:hover": {
						backgroundColor: theme.colors.dark[6],
						color: theme.colors.dark[0],
					},
				}),
				props.className,
			)}
		>
			<div
				className={css({
					display: "flex",
					alignItems: "center",
					flex: 1,
				})}
			>
				<IconElement
					size={20}
					className={css({
						marginRight: theme.spacing.sm,
						color: theme.colors.dark[2],
					})}
					stroke={1.5}
				/>
				<span>{typeof props.children !== "function" && props.children}</span>
			</div>

			{(notificationCount ?? 0) > 0 && (
				<Badge
					size="sm"
					variant="filled"
					className={css({
						padding: 0,
						width: rem(20),
						height: rem(20),
						pointerEvents: "none",
					})}
				>
					{notificationCount}
				</Badge>
			)}
		</RouterLink>
	);
});
