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
	IconBulb,
	IconCards,
	IconClock,
	IconPlanet,
	IconSword,
} from "@tabler/icons-react";
import classes from "./Features.module.css";

export function Features() {
	return (
		<Container className={classes.wrapper}>
			<Text>A universe that keeps its promises</Text>

			<Title className={classes.title} order={2}>
				Depth without the burnout
			</Title>

			<Container size={560} p={0}>
				<Text size="sm" className={classes.description}>
					Space is built for experienced strategy players who want campaigns
					that finish — and stay interesting all the way through. Every system
					is designed to maintain tension, agency, and comeback potential.
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
		title: "Async campaign play",
		description:
			"Submit your turns on your own schedule. Campaigns run over weeks with no live play sessions required — designed to fit around real life without losing strategic depth.",
		icon: IconClock,
	},
	{
		title: "Empire building",
		description:
			"Choose a development stance for each star system each turn — industrialize for ship production, foster population growth, or hold a balance. Every choice shapes your strategic identity.",
		icon: IconPlanet,
	},
	{
		title: "Card-based combat",
		description:
			"When fleets collide, battles unfold over multiple rounds of simultaneous card reveal. Build a deck that reflects your fleet's strength and outmaneuver your enemies tactically.",
		icon: IconCards,
	},
	{
		title: "Dilemma engine",
		description:
			"Recurring high-stakes dilemmas force consequential choices that reshape risk, opportunity, and tempo — preventing runaway leaders and keeping all paths viable through endgame.",
		icon: IconBulb,
	},
	{
		title: "Exploration & colonization",
		description:
			"Scout unknown star systems, discover planet features, and expand your empire through colonization. Govern populations and set immigration policy across your growing territory.",
		icon: IconSword,
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
