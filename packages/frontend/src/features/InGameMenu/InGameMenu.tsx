import { Badge, NavLink as MantineNavLink, rem } from "@mantine/core";
import {
	type Icon,
	IconAd,
	IconHourglass,
	IconLicense,
	IconPlayerPlay,
	IconView360,
} from "@tabler/icons-react";
import { createLink, type LinkProps, useParams } from "@tanstack/react-router";
import { forwardRef } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { mq, theme } from "../../theme";
import { UserButton } from "../UserButton/UserButton";

export function InGameMenu() {
	const { css } = useStyles();

	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
		query NotificationCount($gameId: ID!) {
			game(id: $gameId) {
				id
				dilemmas {
					id
					choosen
				}
			}
		}`),
		variables: { gameId },
	});

	return (
		<nav
			className={css({
				backgroundColor: theme.colors.body,
				padding: theme.spacing.md,
				paddingTop: 0,
				display: "flex",
				flexDirection: "column",
				borderRight: `${rem(1)} solid ${theme.colors.dark[4]}`,
				[mq.md]: {
					display: "none",
				},
			})}
		>
			<Section>
				<UserButton />
			</Section>

			<Section>
				<div className={css({})}>
					<NavLink from="/games/$id" to="." icon={IconView360}>
						Overview
					</NavLink>

					<NavLink
						from="/games/$id"
						to="./dilemmas"
						icon={IconAd}
						activeOptions={{ exact: true }}
						notificationCount={data?.game.dilemmas.length}
					>
						Dilemmas
					</NavLink>

					<NavLink from="/games/$id" to="./ship-designs" icon={IconLicense}>
						Ship Designs
					</NavLink>
				</div>
			</Section>

			<Section>
				<EndTurnButton />
			</Section>
		</nav>
	);
}

function Section({ children }: { children: React.ReactNode }) {
	const { css } = useStyles();

	return (
		<div
			className={css({
				marginInline: `calc(${theme.spacing.md} * -1)`,
				marginBottom: theme.spacing.md,

				"&:not(:last-of-type)": {
					borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
				},
			})}
		>
			{children}
		</div>
	);
}

const ButtonLink = forwardRef<
	HTMLAnchorElement,
	LinkProps & {
		notificationCount?: number;
		icon: Icon;
		className?: string;
	}
>(function Link(
	{ children, notificationCount, icon: IconElement, className, ...props },
	ref,
) {
	const { css } = useStyles();

	return (
		<MantineNavLink
			ref={ref}
			component="a"
			label={
				typeof children === "function"
					? children({ isActive: false, isTransitioning: false })
					: children
			}
			leftSection={
				(notificationCount ?? 0) > 0 ? (
					<Badge
						size="sm"
						variant="filled"
						color="red"
						className={css({
							padding: 0,
							width: rem(20),
							height: rem(20),
							pointerEvents: "none",
						})}
					>
						{notificationCount}
					</Badge>
				) : (
					<IconElement size={20} stroke={1.5} />
				)
			}
			{...props}
		/>
	);
});

const NavLink = createLink(ButtonLink);

function EndTurnButton() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });
	const [{ data }] = useQuery({
		query: graphql(`
			query CurrentTurnEnded($gameId: ID!) {
				game(id: $gameId) {
					id
          me {
						id
            turnEnded
          }
				}
			}
		`),
		variables: { gameId },
	});
	useSubscription({
		query: graphql(`
			subscription CurrentTurn($gameId: ID!) {
				trackGame(gameId: $gameId) { 
					... on TurnEndedEvent {
						game {
							id
							turnNumber
							players {
								id
								turnEnded
							}
						}
					}
				}
			}`),
		variables: { gameId },
	});

	const [, endTurn] = useMutation(
		graphql(`
			mutation EndTurn($gameId: ID!) {
				endTurn(gameId: $gameId) {
					id
				}
			}
	`),
	);

	const TurnIcon = data?.game.me?.turnEnded ? IconHourglass : IconPlayerPlay;

	return (
		<MantineNavLink
			component="button"
			onClick={() => endTurn({ gameId })}
			label="End Turn"
			leftSection={<TurnIcon size={20} stroke={1.5} />}
			description="test"
		/>
	);
}
