import { Avatar, Badge, Group, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight, IconView360 } from "@tabler/icons-react";
import {
	type LinkProps,
	Outlet,
	Link as RouterLink,
	createLazyFileRoute,
} from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { GalaxyView } from "../../features/GalaxyView/GalaxyView";
import { vars } from "../../theme";

export const Route = createLazyFileRoute("/games/$id")({
	component: () => <IngameLayout />,
});

function IngameLayout() {
	const { css } = useStyles();

	const classes = {};

	return (
		<div
			className={css({
				height: "100vh",
				display: "grid",
				gridTemplateColumns: `${rem(300)} 1fr`,
			})}
		>
			<nav
				className={css({
					backgroundColor: vars.colors.body,
					padding: vars.spacing.md,
					paddingTop: 0,
					display: "flex",
					flexDirection: "column",
					borderRight: `${rem(1)} solid ${vars.colors.dark[4]}`,
				})}
			>
				<Section>
					<UserButton />
				</Section>

				<Section>
					<div className={css({})}>
						<Link to="/games/$id">
							<div
								className={css({
									display: "flex",
									alignItems: "center",
									flex: 1,
								})}
							>
								<IconView360
									size={20}
									className={css({
										marginRight: vars.spacing.sm,
										color: vars.colors.dark[2],
									})}
									stroke={1.5}
								/>
								<span>Overview</span>
							</div>

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
								2
							</Badge>
						</Link>
					</div>
				</Section>
				{/* 
				<Section>
					<Group className={classes.collectionsHeader} justify="space-between">
						<Text size="xs" fw={500} c="dimmed">
							Collections
						</Text>
						<Tooltip label="Create collection" withArrow position="right">
							<ActionIcon variant="default" size={18}>
								<IconPlus
									style={{ width: rem(12), height: rem(12) }}
									stroke={1.5}
								/>
							</ActionIcon>
						</Tooltip>
					</Group>
					<div className={classes.collections}>
						<RouterLink
							onClick={(event) => event.preventDefault()}
							className={classes.collectionLink}
						>
							<span style={{ marginRight: rem(9), fontSize: rem(16) }}>
								EMOJI
							</span>{" "}
							label
						</RouterLink>
					</div>
				</Section> */}
			</nav>

			<main>
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
				marginInline: `calc(${vars.spacing.md} * -1)`,
				marginBottom: vars.spacing.md,

				"&:not(:last-of-type)": {
					borderBottom: `${rem(1)} solid ${vars.colors.dark[4]}`,
				},
			})}
		>
			{children}
		</div>
	);
}

const Link = forwardRef<HTMLAnchorElement, LinkProps & { className?: string }>(
	function Link(props, ref) {
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
						padding: `${vars.spacing.xs} ${vars.spacing.xs}`,
						borderRadius: vars.radius.sm,
						fontSize: vars.fontSizes.sm,
						fontWeight: 500,
						color: vars.colors.dark[0],
						textDecoration: "none",

						"&:hover": {
							backgroundColor: vars.colors.dark[6],
							color: vars.colors.dark[0],
						},
					}),
					props.className,
				)}
			/>
		);
	},
);

function UserButton() {
	const { css } = useStyles();

	return (
		<UnstyledButton
			className={css({
				display: "block",
				width: "100%",
				padding: vars.spacing.md,
				color: vars.colors.dark[0],

				"&:hover": {
					backgroundColor: vars.colors.dark[8],
				},
			})}
		>
			<Group>
				<Avatar
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
					radius="xl"
				/>

				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						Harriette Spoonlicker
					</Text>

					<Text c="dimmed" size="xs">
						hspoonlicker@outlook.com
					</Text>
				</div>

				<IconChevronRight
					className={css({ width: rem(14), height: rem(14) })}
					stroke={1.5}
				/>
			</Group>
		</UnstyledButton>
	);
}
