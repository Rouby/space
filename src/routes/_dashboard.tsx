import {
	Anchor,
	Box,
	Burger,
	Button,
	Center,
	Collapse,
	Container,
	Divider,
	Drawer,
	Group,
	HoverCard,
	ScrollArea,
	SimpleGrid,
	Text,
	ThemeIcon,
	UnstyledButton,
	rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconClockCog } from "@tabler/icons-react";
import {
	type LinkProps,
	Outlet,
	Link as RouterLink,
	createFileRoute,
} from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { mq, theme, vars } from "../theme";

export const Route = createFileRoute("/_dashboard")({
	component: () => <DashboardLayout />,
});

function DashboardLayout() {
	const { css } = useStyles();

	const classes = {};

	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

	return (
		<>
			<Box pb="md">
				<header
					className={css({
						height: rem(80),
						paddingLeft: vars.spacing.md,
						paddingRight: vars.spacing.md,
						borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
					})}
				>
					<Group justify="space-between" h="100%">
						{/* <MantineLogo size={30} /> */}
						<div />

						<Group h="100%" gap={0} visibleFrom="sm">
							<Link to="/">Home</Link>

							<Link to="/games">Games</Link>

							<HoverCard
								width={600}
								position="bottom"
								radius="md"
								shadow="md"
								withinPortal
							>
								<HoverCard.Target>
									<Link to="/features">
										<Center inline>
											<Box component="span" mr={5}>
												Features
											</Box>
											<IconChevronDown
												style={{ width: rem(16), height: rem(16) }}
												color={theme.colors.blue[6]}
											/>
										</Center>
									</Link>
								</HoverCard.Target>

								<HoverCard.Dropdown style={{ overflow: "hidden" }}>
									<Group justify="space-between" px="md">
										<Text fw={500}>Features</Text>
										<Anchor component={Link} to="/features" fz="xs">
											View all
										</Anchor>
									</Group>

									<Divider my="sm" />

									<SimpleGrid cols={2} spacing={0}>
										<Features />
									</SimpleGrid>

									<div
										className={css({
											backgroundColor: vars.colors.dark[7],
											margin: `${vars.spacing.sm} calc(${vars.spacing.md} * -1) calc(${vars.spacing.md} * -1) calc(${vars.spacing.md} * -1)`,
											padding: `${vars.spacing.md} calc(${vars.spacing.md} * 2)`,
											paddingBottom: vars.spacing.xl,
											borderTop: `${rem(1)} solid ${vars.colors.dark[5]}`,
										})}
									>
										<Group justify="space-between">
											<div>
												<Text fw={500} fz="sm">
													Get started
												</Text>
												<Text size="xs" c="dimmed">
													Their food sources have decreased, and their numbers
												</Text>
											</div>
											<Button variant="default">Get started</Button>
										</Group>
									</div>
								</HoverCard.Dropdown>
							</HoverCard>

							<Link to="/learn">Learn</Link>
						</Group>

						<Group visibleFrom="sm">
							<Button variant="default" component={RouterLink} to="/signin">
								Log in
							</Button>
							<Button component={RouterLink} to="/signin">
								Sign up
							</Button>
						</Group>

						<Burger
							opened={drawerOpened}
							onClick={toggleDrawer}
							hiddenFrom="sm"
						/>
					</Group>
				</header>

				<Drawer
					opened={drawerOpened}
					onClose={closeDrawer}
					size="100%"
					padding="md"
					title="Navigation"
					hiddenFrom="sm"
					zIndex={1000000}
				>
					<ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
						<Divider my="sm" />

						<Link to="/">Home</Link>

						<Link to="/games">Games</Link>

						<UnstyledButton
							className={css({
								display: "flex",
								alignItems: "center",
								height: "100%",
								paddingInline: vars.spacing.md,
								textDecoration: "none",
								color: vars.colors.white,
								fontWeight: 500,
								fontSize: vars.fontSizes.sm,

								[mq.sm]: {
									height: rem(42),
									width: "100%",
								},

								"&:hover": {
									backgroundColor: theme.colors.dark[6],
								},
							})}
							onClick={toggleLinks}
						>
							<Center inline>
								<Box component="span" mr={5}>
									Features
								</Box>
								<IconChevronDown
									style={{ width: rem(16), height: rem(16) }}
									color={theme.colors.blue[6]}
								/>
							</Center>
						</UnstyledButton>
						<Collapse in={linksOpened}>
							<Features />
						</Collapse>

						<Link to="/learn">Learn</Link>

						<Divider my="sm" />

						<Group justify="center" grow pb="xl" px="md">
							<Button variant="default" component={Link} to="/signin">
								Log in
							</Button>
							<Button component={RouterLink} to="/signin">
								Sign up
							</Button>
						</Group>
					</ScrollArea>
				</Drawer>
			</Box>

			<Container>
				<Outlet />
			</Container>
		</>
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
						height: "100%",
						paddingInline: vars.spacing.md,
						textDecoration: "none",
						color: vars.colors.white,
						fontWeight: 500,
						fontSize: vars.fontSizes.sm,

						[mq.sm]: {
							height: rem(42),
							width: "100%",
						},

						"&:hover": {
							backgroundColor: theme.colors.dark[6],
						},
					}),
					props.className,
				)}
			/>
		);
	},
);

function Features() {
	const { css } = useStyles();

	return (
		<>
			<UnstyledButton
				component={Link}
				className={css({
					width: "100%",
					padding: `${vars.spacing.xs} ${vars.spacing.md}`,
					borderRadius: vars.radius.md,

					"&:hover": {
						backgroundColor: theme.colors.dark[7],
					},
				})}
				to="/features"
			>
				<Group wrap="nowrap" align="flex-start">
					<ThemeIcon size={34} variant="default" radius="md">
						<IconClockCog
							style={{ width: rem(22), height: rem(22) }}
							color={theme.colors.blue[6]}
						/>
					</ThemeIcon>
					<div>
						<Text size="sm" fw={500}>
							Turn based
						</Text>
						<Text size="xs" c="dimmed">
							Play at your own pace
						</Text>
					</div>
				</Group>
			</UnstyledButton>
		</>
	);
}
