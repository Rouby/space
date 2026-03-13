import {
	Button,
	Container,
	Group,
	rem,
	SimpleGrid,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconBulb,
	IconCards,
	IconKarate,
	IconPlanet,
	IconRocket,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import classes from "./LearnPage.module.css";

const CONCEPTS = [
	{
		step: 1,
		icon: IconRocket,
		title: "How campaigns work",
		body: "Space is played in turns across an asynchronous campaign. Each player submits their turn independently — there's no need to coordinate live. Once all players have submitted (or the turn window closes), the simulation resolves and the next turn begins. Campaigns run over days or weeks, not hours.",
	},
	{
		step: 2,
		icon: IconPlanet,
		title: "Developing your empire",
		body: "You start with a home star system. Each owned system can be directed with a development stance: Industrialize it to boost ship production, Grow Population for long-term economic strength, or Balance both. You'll discover planet features, harvest resources, and expand to new systems through colonization as your empire grows.",
	},
	{
		step: 3,
		icon: IconCards,
		title: "Commanding your fleet",
		body: "Build task forces from your ship designs and assign them to systems or send them into the galaxy. When your fleet's path intersects an enemy's, an engagement is created automatically — and your turn can't end until battles are resolved. Fleets are strategic assets; lose them and you lose influence.",
	},
	{
		step: 4,
		icon: IconKarate,
		title: "How battles resolve",
		body: "Battle is a turn-within-a-turn. Each round, both sides choose a card from their deck simultaneously, then reveal. Cards carry buffs, counters, and combat effects — understanding the matchups is the key to winning. Each round produces a battle log entry. The fight ends when one side retreats, is destroyed, or achieves the victory condition.",
	},
	{
		step: 5,
		icon: IconBulb,
		title: "Strategic dilemmas",
		body: "Throughout your campaign, you'll face dilemmas — high-stakes choices that carry real consequences. Accept a risky alliance, sacrifice production for a military advantage, or absorb a population crisis in exchange for strategic positioning. Dilemmas are how Space keeps the game interesting in the late campaign when other 4X games become predetermined.",
	},
];

export function LearnPage() {
	return (
		<>
			<div className={classes.hero}>
				<Container size="md">
					<Title className={classes.heroTitle}>
						Learn to play{" "}
						<Text
							component="span"
							variant="gradient"
							gradient={{ from: "blue", to: "cyan" }}
							inherit
						>
							Space
						</Text>
					</Title>
					<Text c="dimmed" size="lg" maw={540} mx="auto">
						Space combines long-form async strategy with a high-signal turn
						loop. Here's what you need to know before your first campaign.
					</Text>
				</Container>
			</div>

			<div className={classes.imageSection}>
				<Container size="lg">
					<img
						src="/images/promo/learn.png"
						alt="Space strategy game board with hexagonal territory zones, fleet icons, and decision cards"
						className={classes.learnImage}
					/>
				</Container>
			</div>

			<div className={classes.cardsSection}>
				<Container size="lg">
					<SimpleGrid
						cols={{ base: 1, sm: 2 }}
						spacing="xl"
						verticalSpacing="xl"
					>
						{CONCEPTS.map((concept) => (
							<div key={concept.step} className={classes.card}>
								<Group gap="sm" mb="xs">
									<ThemeIcon
										size={rem(40)}
										radius={rem(40)}
										variant="gradient"
										gradient={{ from: "blue", to: "cyan" }}
									>
										<concept.icon
											style={{ width: rem(20), height: rem(20) }}
											stroke={1.5}
										/>
									</ThemeIcon>
									<div>
										<Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={1}>
											Step {concept.step}
										</Text>
										<Text fw={700} size="md">
											{concept.title}
										</Text>
									</div>
								</Group>
								<Text size="sm" c="dimmed" lh={1.7} mt="sm">
									{concept.body}
								</Text>
							</div>
						))}
					</SimpleGrid>
				</Container>
			</div>

			<div className={classes.cta}>
				<Container size="sm">
					<Title order={2} mb="md">
						Ready to start your first campaign?
					</Title>
					<Text c="dimmed" mb="xl">
						Create an account, join a lobby with friends, and start playing.
						Your strategy evolves as the campaign unfolds.
					</Text>
					<Group justify="center">
						<Button
							size="lg"
							variant="gradient"
							gradient={{ from: "blue", to: "cyan" }}
							component={Link}
							to="/signin"
						>
							Start your campaign
						</Button>
						<Button size="lg" variant="default" component={Link} to="/features">
							Explore all features
						</Button>
					</Group>
				</Container>
			</div>
		</>
	);
}
