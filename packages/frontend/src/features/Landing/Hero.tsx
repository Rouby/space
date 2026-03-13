import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import classes from "./Hero.module.css";

export function Hero() {
	return (
		<div className={classes.wrapper}>
			<div className={classes.heroImageWrapper}>
				<img
					src="/images/promo/hero.png"
					alt="A sprawling galaxy with glowing star systems and colorful nebulae"
					className={classes.heroImage}
				/>
				<div className={classes.heroOverlay} />
			</div>
			<Container size={800} className={classes.inner}>
				<Title className={classes.title}>
					The async 4X strategy game built for{" "}
					<Text
						component="span"
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						inherit
					>
						long campaigns
					</Text>
				</Title>

				<Text className={classes.description} c="dimmed">
					Space is a browser-based multiplayer space strategy game designed for
					friend groups running campaigns over weeks to months. Build your
					empire, colonize star systems, command fleets, and face consequential
					dilemmas — all without the grind that kills most async campaigns.
				</Text>

				<Group className={classes.controls}>
					<Button
						size="xl"
						className={classes.control}
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						component={Link}
						to="/signin"
					>
						Start your campaign
					</Button>
					<Button
						size="xl"
						className={classes.control}
						variant="default"
						component={Link}
						to="/learn"
					>
						Learn how to play
					</Button>
				</Group>
			</Container>
		</div>
	);
}
