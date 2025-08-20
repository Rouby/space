import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import classes from "./Hero.module.css";

export function Hero() {
	return (
		<div className={classes.wrapper}>
			<Container size={700} className={classes.inner}>
				<Title className={classes.title}>
					A multiplayer space strategy game of{" "}
					<Text
						component="span"
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						inherit
					>
						exploration and conquest
					</Text>
				</Title>

				<Text className={classes.description} color="dimmed">
					Build your fleet, explore unknown star systems, and expand your
					empire. Engage in tactical battles, manage your resources, and compete
					with other players for dominance in a persistent universe.
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
						Get started
					</Button>
				</Group>
			</Container>
		</div>
	);
}
