import {
	Button,
	Container,
	Group,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import classes from "./FeaturesPage.module.css";

const PILLARS = [
	{
		label: "Campaign design",
		title: "Async-first, built for real life",
		image: null,
		body: "Space was designed from the ground up for friend groups who want deep strategy without requiring everyone online at the same time. Campaigns run over weeks or months — submit your turn when it suits you, and the simulation resolves on its own schedule.",
		bullets: [
			"No live play sessions required — fully asynchronous turn submission",
			"Campaign state is preserved across gaps in participation",
			"Missed-turn recovery with a concise state digest to get you back up to speed",
			"Turn windows designed to prevent cognitive overload — high-signal decisions, not endless micromanagement",
			"Campaigns are designed to finish, not fade out",
		],
	},
	{
		label: "Empire management",
		title: "Build an empire that reflects your strategy",
		image: null,
		body: "Every owned star system can be steered with a development stance — industrialize for production capacity, foster population growth for long-term strength, or balance both. Manage resources, govern populations, and set the immigration and growth policies that define your strategic identity.",
		bullets: [
			"Per-turn stance selection per star system: Industrialize, Balance, or Grow Population",
			"Deterministic resource and population deltas — projection shown before you commit",
			"Immigration and population governance controls across your whole empire",
			"Planet feature discovery shapes what each system can become",
			"Industrial output feeds fleet construction and expansion",
		],
	},
	{
		label: "Fleet & combat",
		title: "Command fleets, resolve battles with cards",
		image: "/images/promo/features.png",
		body: "Assemble task forces from your ship designs and send them into the galaxy. When opposing fleets cross paths, engagements are created automatically and must be resolved before the turn can end. Each battle plays out over multiple rounds of simultaneous card reveal — both sides choose their play, then effects are resolved together.",
		bullets: [
			"Build task forces from owned ships and assign them starting locations",
			"Automatic engagement detection when fleet paths cross — no avoiding fights",
			"Card-based combat: simultaneous reveal, buff and counter mechanics",
			"Multi-round battle loops with a full battle log for post-fight review",
			"Component-driven ship designs that express different combat profiles",
			"Combat outcomes feed back into strategic state — fleets are real assets",
		],
	},
	{
		label: "Strategic dynamics",
		title: "A dilemma engine that keeps the game alive",
		image: null,
		body: "As your campaign evolves, you will face recurring dilemmas — high-stakes choices with real, lasting consequences. These are not narrative flavor. They are a structural balancing mechanism: dilemmas reshape risk, opportunity, and tempo, helping prevent any one empire from running away with the game while keeping all strategic paths viable through endgame.",
		bullets: [
			"Consequential choices every turn — not filler, but strategic inflection points",
			"Dilemmas influence campaign pacing and balance pressure dynamically",
			"Comeback paths are built into the system — setbacks are not campaign-ending",
			"Strategic diversity is preserved: no single dominant path to victory",
			"Designed to maintain tension through mid and late campaign, where most async games collapse",
		],
	},
	{
		label: "Exploration & colonization",
		title: "Discover, expand, and govern",
		image: null,
		body: "Beyond your home system lies an unexplored galaxy. Scout unknown star systems, discover what each planet has to offer, and make the call on whether and how to colonize. As your empire grows, so do the governance decisions that shape how your populations develop and migrate across your territory.",
		bullets: [
			"Fleet movement and exploration across a persistent galactic map",
			"Planet feature discovery reveals strategic opportunities for colonized worlds",
			"Passive colonization simulation and active governance controls",
			"Population migration management across colonies",
			"Contested colonization when players race for the same systems",
		],
	},
];

export function FeaturesPage() {
	return (
		<>
			<div className={classes.hero}>
				<div className={classes.heroImageWrapper}>
					<img
						src="/images/promo/features.png"
						alt="Space fleet in battle above a ringed planet"
						className={classes.heroImage}
					/>
					<div className={classes.heroOverlay} />
				</div>
				<Container size="md" className={classes.heroInner}>
					<Title className={classes.heroTitle}>
						Everything you need for an{" "}
						<Text
							component="span"
							variant="gradient"
							gradient={{ from: "blue", to: "cyan" }}
							inherit
						>
							epic space campaign
						</Text>
					</Title>
					<Text c="dimmed" size="lg" maw={600} mx="auto">
						Space combines deep 4X simulation with an async-first design that
						keeps campaigns alive from first contact through final conquest.
					</Text>
				</Container>
			</div>

			{PILLARS.map((pillar, i) => (
				<div key={pillar.label} className={classes.section}>
					<Container size="lg">
						<SimpleGrid
							cols={{ base: 1, md: pillar.image ? 2 : 1 }}
							spacing={60}
							style={
								pillar.image && i % 2 === 0
									? { direction: "ltr" }
									: { direction: "ltr" }
							}
						>
							{pillar.image && (
								<div className={classes.sectionImage}>
									<img
										src={pillar.image}
										alt={pillar.title}
										className={classes.sectionImageImg}
									/>
								</div>
							)}
							<div>
								<Text className={classes.sectionLabel}>{pillar.label}</Text>
								<Title className={classes.sectionTitle} order={2}>
									{pillar.title}
								</Title>
								<Text c="dimmed" mb="xl" lh={1.7}>
									{pillar.body}
								</Text>
								{pillar.bullets.map((b) => (
									<div key={b} className={classes.bullet}>
										<div className={classes.bulletDot} />
										<Text size="sm" c="dimmed" lh={1.6}>
											{b}
										</Text>
									</div>
								))}
							</div>
						</SimpleGrid>
					</Container>
				</div>
			))}

			<div className={classes.cta}>
				<Container size="sm">
					<Title order={2} mb="md">
						Ready to start your campaign?
					</Title>
					<Text c="dimmed" mb="xl">
						Join a game with friends and experience an async strategy campaign
						that's designed to finish.
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
						<Button size="lg" variant="default" component={Link} to="/learn">
							Learn how to play
						</Button>
					</Group>
				</Container>
			</div>
		</>
	);
}
