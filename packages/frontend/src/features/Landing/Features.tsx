import {
	Container,
	rem,
	SimpleGrid,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import {
	IconCookie,
	IconGauge,
	IconLock,
	IconMessage2,
	IconUser,
} from "@tabler/icons-react";
import classes from "./Features.module.css";

export function Features() {
	return (
		<Container className={classes.wrapper}>
			<Text>A new universe awaits</Text>

			<Title className={classes.title} order={2}>
				Explore a galaxy of possibilities
			</Title>

			<Container size={560} p={0}>
				<Text size="sm" className={classes.description}>
					This is a game of strategy, cunning, and luck. Explore the galaxy,
					build your empire, and conquer your enemies.
				</Text>
			</Container>

			<SimpleGrid
				mt={60}
				cols={{ base: 1, sm: 2, md: 3 }}
				spacing={{ base: "xl", md: 50 }}
				verticalSpacing={{ base: "xl", md: 50 }}
			>
				{MOCKDATA.map((feature) => (
					<Feature {...feature} key={feature.title} />
				))}
			</SimpleGrid>
		</Container>
	);
}

const MOCKDATA = [
	{
		title: "Fleet Customization",
		description:
			"Design and build your own ships. Choose from a variety of components to create the ultimate fleet.",
		icon: IconGauge,
	},
	{
		title: "Tactical Combat",
		description:
			"Engage in strategic turn-based battles. Outsmart your opponents with clever tactics and superior firepower.",
		icon: IconUser,
	},
	{
		title: "Resource Management",
		description:
			"Explore star systems to find and harvest resources. Manage your economy to fuel your war machine.",
		icon: IconCookie,
	},
	{
		title: "Persistent Universe",
		description:
			"Play in a persistent world where your actions have lasting consequences. The game continues even when you are offline.",
		icon: IconLock,
	},
	{
		title: "Multiplayer",
		description:
			"Compete with other players for control of the galaxy. Form alliances or go it alone.",
		icon: IconMessage2,
	},
];

function Feature({
	icon: Icon,
	title,
	description,
}: {
	icon: Icon;
	title: React.ReactNode;
	description: React.ReactNode;
}) {
	return (
		<div>
			<ThemeIcon variant="light" size={40} radius={40}>
				<Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
			</ThemeIcon>
			<Text mt="sm" mb={7}>
				{title}
			</Text>
			<Text size="sm" c="dimmed" lh={1.6}>
				{description}
			</Text>
		</div>
	);
}
