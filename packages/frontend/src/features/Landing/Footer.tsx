import { ActionIcon, Anchor, Container, Group, rem, Text } from "@mantine/core";
import {
	IconBrandDiscord,
	IconBrandGithub,
	IconBrandTwitter,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import classes from "./Footer.module.css";

const links = [
	{ link: "/features", label: "Features", internal: true },
	{ link: "/learn", label: "Learn", internal: true },
	{ link: "#", label: "Privacy", internal: false },
	{ link: "#", label: "Contact", internal: false },
];

export function Footer() {
	const items = links.map((link) =>
		link.internal ? (
			<Anchor
				c="dimmed"
				key={link.label}
				component={Link}
				to={link.link as "/features" | "/learn"}
				lh={1}
				size="sm"
			>
				{link.label}
			</Anchor>
		) : (
			<Anchor
				c="dimmed"
				key={link.label}
				href={link.link}
				lh={1}
				onClick={(event) => event.preventDefault()}
				size="sm"
			>
				{link.label}
			</Anchor>
		),
	);

	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Text
					fw={700}
					size="lg"
					variant="gradient"
					gradient={{ from: "blue", to: "cyan" }}
					component="span"
				>
					Space
				</Text>
				<Group className={classes.links}>{items}</Group>

				<Group gap="xs" justify="flex-end" wrap="nowrap">
					<ActionIcon size="lg" variant="default" radius="xl">
						<IconBrandTwitter
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
					<ActionIcon size="lg" variant="default" radius="xl">
						<IconBrandDiscord
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
					<ActionIcon size="lg" variant="default" radius="xl">
						<IconBrandGithub
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Container>
		</div>
	);
}
