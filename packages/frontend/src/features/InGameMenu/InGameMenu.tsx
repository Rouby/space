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
import { forwardRef, useEffect, useRef, useState } from "react";
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

	const unresolvedDilemmasCount =
		data?.game.dilemmas.filter((dilemma) => !dilemma.choosen).length ?? 0;

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
						notificationCount={unresolvedDilemmasCount}
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
	const [endTurnRequested, setEndTurnRequested] = useState(false);
	const [newTurnCalculated, setNewTurnCalculated] = useState(false);
	const [hasAdvancedTurn, setHasAdvancedTurn] = useState(false);
	const newTurnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [{ data }] = useQuery({
		query: graphql(`
			query CurrentTurnEnded($gameId: ID!) {
				game(id: $gameId) {
					id
					dilemmas {
						id
						choosen
					}
					me {
						id
						turnEnded
					}
				}
			}
		`),
		variables: { gameId },
	});

	const [turnEvents] = useSubscription({
		query: graphql(`
			subscription CurrentTurn($gameId: ID!) {
				trackGame(gameId: $gameId) {
					__typename
					... on NewTurnCalculatedEvent {
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
			}
		`),
		variables: { gameId },
	});

	console.log(turnEvents);

	useEffect(() => {
		if (
			!turnEvents.data?.trackGame ||
			turnEvents.data.trackGame.__typename !== "NewTurnCalculatedEvent"
		) {
			return;
		}

		setEndTurnRequested(false);
		setHasAdvancedTurn(true);
		setNewTurnCalculated(true);
	}, [turnEvents.data?.trackGame]);

	useEffect(() => {
		if (data?.game.me?.turnEnded === false) {
			setHasAdvancedTurn(false);
		}
	}, [data?.game.me?.turnEnded]);

	useEffect(() => {
		if (!newTurnCalculated) {
			return;
		}

		newTurnTimeoutRef.current = setTimeout(() => {
			setNewTurnCalculated(false);
		}, 6000);

		return () => {
			if (newTurnTimeoutRef.current) {
				clearTimeout(newTurnTimeoutRef.current);
			}
		};
	}, [newTurnCalculated]);

	const [endTurnResult, endTurn] = useMutation(
		graphql(`
			mutation EndTurn($gameId: ID!) {
				endTurn(gameId: $gameId) {
					id
				}
			}
		`),
	);

	const hasUnresolvedDilemmas =
		(data?.game.dilemmas.filter((dilemma) => !dilemma.choosen).length ?? 0) > 0;

	const isTurnEnded = Boolean(data?.game.me?.turnEnded) && !hasAdvancedTurn;
	const hasEndedTurn = isTurnEnded || endTurnRequested;
	const TurnIcon = hasEndedTurn ? IconHourglass : IconPlayerPlay;
	const buttonDescription = hasUnresolvedDilemmas
		? "Resolve all dilemmas before ending turn"
		: endTurnResult.error
			? "Could not end turn. Try again"
			: newTurnCalculated
				? "New turn calculated. You can issue orders"
				: endTurnResult.fetching
					? "Ending turn..."
					: hasEndedTurn
						? "Turn ended. Waiting for other players"
						: "Ready to end turn";

	return (
		<MantineNavLink
			component="button"
			onClick={async () => {
				if (hasUnresolvedDilemmas) {
					return;
				}

				setEndTurnRequested(true);
				const result = await endTurn({ gameId });

				if (result.error) {
					setEndTurnRequested(false);
				}
			}}
			disabled={hasUnresolvedDilemmas || hasEndedTurn || endTurnResult.fetching}
			label={hasEndedTurn ? "Turn Ended" : "End Turn"}
			leftSection={<TurnIcon size={20} stroke={1.5} />}
			rightSection={newTurnCalculated ? <Badge color="green">NEW</Badge> : null}
			description={buttonDescription}
		/>
	);
}
