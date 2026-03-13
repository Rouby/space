import {
	Anchor,
	Box,
	Burger,
	Button,
	Center,
	Collapse,
	Divider,
	Drawer,
	Group,
	HoverCard,
	rem,
	ScrollArea,
	SimpleGrid,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useStyles } from "tss-react";
import { useAuth } from "../../Auth";
import { mq, theme } from "../../theme";
import { UserButton } from "../UserButton/UserButton";
import { FeatureList } from "./FeatureList";
import { Link } from "./Link";

export function Header() {
	const { css } = useStyles();

	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

	const { me } = useAuth();

	return (
		<Box pb="md">
			<header
				className={css({
					height: rem(80),
					paddingLeft: theme.spacing.md,
					paddingRight: theme.spacing.md,
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
									<FeatureList />
								</SimpleGrid>

								<div
									className={css({
										backgroundColor: theme.colors.dark[7],
										margin: `${theme.spacing.sm} calc(${theme.spacing.md} * -1) calc(${theme.spacing.md} * -1) calc(${theme.spacing.md} * -1)`,
										padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
										paddingBottom: theme.spacing.xl,
										borderTop: `${rem(1)} solid ${theme.colors.dark[5]}`,
									})}
								>
									<Group justify="space-between">
										<div>
											<Text fw={500} fz="sm">
												Ready to command your empire?
											</Text>
											<Text size="xs" c="dimmed">
												Start your campaign today — it's free to play.
											</Text>
										</div>
										<Button
											variant="default"
											component={RouterLink}
											to="/signin"
										>
											Get started
										</Button>
									</Group>
								</div>
							</HoverCard.Dropdown>
						</HoverCard>

						<Link to="/learn">Learn</Link>
					</Group>

					{me ? (
						<UserButton />
					) : (
						<Group visibleFrom="sm">
							<Button variant="default" component={RouterLink} to="/signin">
								Log in
							</Button>
							<Button component={RouterLink} to="/signin">
								Sign up
							</Button>
						</Group>
					)}

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
							paddingInline: theme.spacing.md,
							textDecoration: "none",
							color: theme.colors.white,
							fontWeight: 500,
							fontSize: theme.fontSizes.sm,

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
						<FeatureList />
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
	);
}
