import { Group, rem, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import {
	IconBulb,
	IconCards,
	IconClockCog,
	IconPlanet,
	IconSword,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useStyles } from "tss-react";
import { theme } from "../../theme";

const FEATURES = [
	{
		icon: IconClockCog,
		title: "Async campaign play",
		tagline: "Submit turns on your schedule",
	},
	{
		icon: IconPlanet,
		title: "Empire building",
		tagline: "Develop star systems, grow populations",
	},
	{
		icon: IconCards,
		title: "Card-based combat",
		tagline: "Simultaneous reveal, buff & counter",
	},
	{
		icon: IconBulb,
		title: "Dilemma engine",
		tagline: "Consequential choices every turn",
	},
	{
		icon: IconSword,
		title: "Exploration & colonization",
		tagline: "Scout systems, expand your territory",
	},
];

export function FeatureList() {
	const { css } = useStyles();

	return (
		<>
			{FEATURES.map((f) => (
				<UnstyledButton
					key={f.title}
					component={Link}
					className={css({
						width: "100%",
						padding: `${theme.spacing.xs} ${theme.spacing.md}`,
						borderRadius: theme.radius.md,

						"&:hover": {
							backgroundColor: theme.colors.dark[7],
						},
					})}
					to="/features"
				>
					<Group wrap="nowrap" align="flex-start">
						<ThemeIcon size={34} variant="default" radius="md">
							<f.icon
								style={{ width: rem(22), height: rem(22) }}
								color={theme.colors.blue[6]}
							/>
						</ThemeIcon>
						<div>
							<Text size="sm" fw={500}>
								{f.title}
							</Text>
							<Text size="xs" c="dimmed">
								{f.tagline}
							</Text>
						</div>
					</Group>
				</UnstyledButton>
			))}
		</>
	);
}
