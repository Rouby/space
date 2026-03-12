import {
	Anchor,
	Badge,
	NavLink as MantineNavLink,
	rem,
	Stack,
	Text,
} from "@mantine/core";
import {
	type Icon,
	IconAd,
	IconFileDescription,
	IconHourglass,
	IconLicense,
	IconPlayerPlay,
	IconView360,
} from "@tabler/icons-react";
import {
	createLink,
	Link,
	type LinkProps,
	useParams,
} from "@tanstack/react-router";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { mq, theme } from "../../theme";

import { UserButton } from "../UserButton/UserButton";

function getEndTurnErrorMessage(
	error:
		| { graphQLErrors?: Array<{ extensions?: { code?: string } }> }
		| null
		| undefined,
) {
	const code = error?.graphQLErrors?.[0]?.extensions?.code;

	switch (code) {
		case "UNRESOLVED_DILEMMAS":
			return "Resolve all dilemmas before ending turn";
		case "UNRESOLVED_ENGAGEMENTS":
			return "Resolve all active battles before ending turn";
		case "TURN_ALREADY_ENDED":
			return "Turn already ended. Waiting for other players";
		case "NOT_AUTHORIZED":
			return "You are not allowed to end turn for this campaign";
		case "GAME_NOT_STARTED":
			return "Campaign has not started yet";
		case "TURN_WINDOW_MISMATCH":
			return "Turn window changed. Refresh and try again";
		default:
			return "Could not end turn. Try again";
	}
}

function getTrackGameErrorMessage(
	error:
		| { graphQLErrors?: Array<{ extensions?: { code?: string } }> }
		| null
		| undefined,
) {
	const code = error?.graphQLErrors?.[0]?.extensions?.code;

	switch (code) {
		case "NOT_AUTHORIZED":
			return "Live turn monitoring is not available for this campaign";
		default:
			return "Live turn monitoring disconnected. Retry or refresh";
	}
}

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

					<NavLink
						from="/games/$id"
						to="./turn-reports"
						icon={IconFileDescription}
					>
						Turn Reports
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
					turnNumber
					me {
						id
						turnEnded
					}
					dilemmas {
						id
						choosen
					}
					activeTaskForceEngagements {
						id
						phase
						currentRound
						participantA {
							submittedCardId
						}
						participantB {
							submittedCardId
						}
						taskForceA {
							id
							name
							owner {
								user {
									id
								}
							}
						}
						taskForceB {
							id
							name
							owner {
								user {
									id
								}
							}
						}
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
			mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) {
				endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) {
					id
				}
			}
		`),
	);

	const hasUnresolvedDilemmas =
		(data?.game.dilemmas.filter((dilemma) => !dilemma.choosen).length ?? 0) > 0;

	const unresolvedBattleBlockers =
		data?.game.activeTaskForceEngagements
			.map((engagement) => {
				const meId = data.game.me?.id;
				if (!meId) {
					return null;
				}

				const ownSide =
					engagement.taskForceA.owner?.user.id === meId
						? "A"
						: engagement.taskForceB.owner?.user.id === meId
							? "B"
							: null;

				if (!ownSide) {
					return null;
				}

				const ownTaskForce =
					ownSide === "A" ? engagement.taskForceA : engagement.taskForceB;
				const opponentTaskForce =
					ownSide === "A" ? engagement.taskForceB : engagement.taskForceA;
				const ownSubmittedCardId =
					ownSide === "A"
						? engagement.participantA.submittedCardId
						: engagement.participantB.submittedCardId;

				const actionRequired =
					engagement.phase === "awaiting_submissions" && !ownSubmittedCardId;

				return {
					id: engagement.id,
					phase: engagement.phase,
					currentRound: engagement.currentRound,
					label: `${ownTaskForce.name} vs ${opponentTaskForce.name}`,
					actionRequired,
					reason: actionRequired
						? "Action required: submit a combat card or retreat"
						: "Battle unresolved: waiting for other participant or resolution",
				};
			})
			.filter((blocker) => blocker !== null) ?? [];

	const unresolvedBattlesCount = unresolvedBattleBlockers.length;
	const pendingBattleActionCount = unresolvedBattleBlockers.filter(
		(blocker) => blocker.actionRequired,
	).length;
	const hasUnresolvedEngagements = unresolvedBattlesCount > 0;

	const isTurnEnded = Boolean(data?.game.me?.turnEnded) && !hasAdvancedTurn;
	const hasEndedTurn = isTurnEnded || endTurnRequested;
	const TurnIcon = hasEndedTurn ? IconHourglass : IconPlayerPlay;
	const unresolvedBattlesMessage =
		pendingBattleActionCount > 0
			? `Complete ${pendingBattleActionCount} pending battle action${pendingBattleActionCount === 1 ? "" : "s"} before ending turn`
			: `Resolve ${unresolvedBattlesCount} active battle${unresolvedBattlesCount === 1 ? "" : "s"} before ending turn`;
	const buttonDescription = hasUnresolvedDilemmas
		? "Resolve all dilemmas before ending turn"
		: hasUnresolvedEngagements
			? unresolvedBattlesMessage
			: turnEvents.error
				? getTrackGameErrorMessage(turnEvents.error)
				: endTurnResult.error
					? getEndTurnErrorMessage(endTurnResult.error)
					: newTurnCalculated
						? "New turn calculated. You can issue orders"
						: endTurnResult.fetching
							? "Ending turn..."
							: hasEndedTurn
								? "Turn ended. Waiting for other players"
								: "Ready to end turn";

	return (
		<Stack gap="xs">
			{hasUnresolvedEngagements && (
				<Stack gap={4}>
					<Text size="xs" fw={600}>
						Unresolved Battles ({unresolvedBattlesCount})
					</Text>
					{unresolvedBattleBlockers.map((blocker) => (
						<Stack key={blocker.id} gap={0}>
							<Anchor
								component={Link}
								to="/games/$id/engagement/$engagementId"
								params={{ id: gameId, engagementId: blocker.id } as never}
								size="xs"
							>
								{blocker.label}
							</Anchor>
							<Text size="xs" c="dimmed">
								Round {blocker.currentRound} • {blocker.reason}
							</Text>
						</Stack>
					))}
				</Stack>
			)}

			<MantineNavLink
				component="button"
				onClick={async () => {
					if (hasUnresolvedDilemmas || hasUnresolvedEngagements) {
						return;
					}

					if (typeof data?.game.turnNumber !== "number") {
						return;
					}

					setEndTurnRequested(true);
					const result = await endTurn({
						expectedTurnNumber: data.game.turnNumber,
						gameId,
					});

					if (result.error) {
						setEndTurnRequested(false);
					}
				}}
				disabled={
					hasUnresolvedDilemmas ||
					hasUnresolvedEngagements ||
					hasEndedTurn ||
					endTurnResult.fetching
				}
				label={hasEndedTurn ? "Turn Ended" : "End Turn"}
				leftSection={<TurnIcon size={20} stroke={1.5} />}
				rightSection={
					newTurnCalculated ? <Badge color="green">NEW</Badge> : null
				}
				description={buttonDescription}
			/>
		</Stack>
	);
}
