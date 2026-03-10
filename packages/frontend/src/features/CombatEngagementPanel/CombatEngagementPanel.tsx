import {
	Alert,
	Badge,
	Button,
	Card,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useMemo } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

const CARD_LABELS: Record<string, string> = {
	laser_burst: "Laser Burst",
	target_lock: "Target Lock",
	emergency_repairs: "Emergency Repairs",
	shield_pulse: "Shield Pulse",
	evasive_maneuver: "Evasive Maneuver",
	overcharge_barrage: "Overcharge Barrage",
};

export function CombatEngagementPanel({
	engagementId,
}: {
	engagementId: string;
}) {
	const { me } = useAuth();
	const [{ data, fetching, error }, reexecuteQuery] = useQuery({
		query: graphql(`
			query CombatEngagementPanel($id: ID!) {
				taskForceEngagement(id: $id) {
					id
					phase
					currentRound
					winnerTaskForceId
					taskForceA {
						id
						name
						owner {
							id
							name
						}
					}
					taskForceB {
						id
						name
						owner {
							id
							name
						}
					}
					participantA {
						taskForceId
						hp
						maxHp
						hand
						deckRemaining
						submittedCardId
					}
					participantB {
						taskForceId
						hp
						maxHp
						hand
						deckRemaining
						submittedCardId
					}
					roundLog {
						round
						attackerTaskForceId
						targetTaskForceId
						cardId
						effectType
						resolvedValue
						attackerHpAfter
						targetHpAfter
					}
				}
			}
		`),
		variables: { id: engagementId },
		requestPolicy: "cache-and-network",
	});

	useSubscription(
		{
			query: graphql(`
				subscription TrackTaskForceEngagement($engagementId: ID!) {
					trackTaskForceEngagement(engagementId: $engagementId) {
						id
						phase
						currentRound
					}
				}
			`),
			variables: { engagementId },
		},
		() => {
			reexecuteQuery({ requestPolicy: "network-only" });
			return null;
		},
	);

	const [, submitAction] = useMutation(
		graphql(`
			mutation SubmitTaskForceEngagementAction($input: SubmitTaskForceEngagementActionInput!) {
				submitTaskForceEngagementAction(input: $input) {
					id
					phase
					currentRound
				}
			}
		`),
	);

	const engagement = data?.taskForceEngagement;

	const ownParticipant = useMemo(() => {
		if (!engagement || !me?.id) {
			return null;
		}

		if (engagement.taskForceA.owner?.id.endsWith(me.id)) {
			return engagement.participantA;
		}
		if (engagement.taskForceB.owner?.id.endsWith(me.id)) {
			return engagement.participantB;
		}
		return null;
	}, [engagement, me?.id]);

	if (fetching && !engagement) {
		return <Text>Loading engagement...</Text>;
	}

	if (error) {
		return (
			<Alert color="red" title="Unable to load engagement">
				{error.message}
			</Alert>
		);
	}

	if (!engagement || !ownParticipant) {
		return (
			<Alert color="yellow" title="Engagement unavailable">
				This engagement is unavailable or you are not a participant.
			</Alert>
		);
	}

	const canSubmit =
		engagement.phase === "awaiting_submissions" &&
		!ownParticipant.submittedCardId;
	const cardRenderCounts = new Map<string, number>();

	return (
		<Stack gap="md">
			<Group justify="space-between" align="center">
				<Title order={3}>Combat Engagement</Title>
				<Group gap="xs">
					<Badge variant="light">Round {engagement.currentRound}</Badge>
					<Badge>{engagement.phase}</Badge>
				</Group>
			</Group>

			<SimpleGrid cols={{ base: 1, md: 2 }}>
				<Card withBorder>
					<Stack gap={4}>
						<Text fw={700}>{engagement.taskForceA.name}</Text>
						<Text size="sm">
							HP {engagement.participantA.hp}/{engagement.participantA.maxHp}
						</Text>
						<Text size="xs" c="dimmed">
							Deck remaining: {engagement.participantA.deckRemaining}
						</Text>
					</Stack>
				</Card>
				<Card withBorder>
					<Stack gap={4}>
						<Text fw={700}>{engagement.taskForceB.name}</Text>
						<Text size="sm">
							HP {engagement.participantB.hp}/{engagement.participantB.maxHp}
						</Text>
						<Text size="xs" c="dimmed">
							Deck remaining: {engagement.participantB.deckRemaining}
						</Text>
					</Stack>
				</Card>
			</SimpleGrid>

			<Stack gap="xs">
				<Text fw={600}>Your hand</Text>
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
					{ownParticipant.hand.map((cardId) => {
						const occurrence = (cardRenderCounts.get(cardId) ?? 0) + 1;
						cardRenderCounts.set(cardId, occurrence);

						return (
							<Button
								key={`${cardId}-${occurrence}`}
								variant="light"
								disabled={!canSubmit}
								onClick={async () => {
									await submitAction({
										input: { engagementId: engagement.id, cardId },
									});
									reexecuteQuery({ requestPolicy: "network-only" });
								}}
							>
								{CARD_LABELS[cardId] ?? cardId}
							</Button>
						);
					})}
				</SimpleGrid>
				{ownParticipant.submittedCardId && (
					<Text size="sm" c="dimmed">
						Submitted:{" "}
						{CARD_LABELS[ownParticipant.submittedCardId] ??
							ownParticipant.submittedCardId}
					</Text>
				)}
			</Stack>

			<Stack gap="xs">
				<Text fw={600}>Battle log</Text>
				{engagement.roundLog.length === 0 && (
					<Text size="sm" c="dimmed">
						No resolved actions yet.
					</Text>
				)}
				{engagement.roundLog.map((entry, index) => (
					<Card
						key={`${entry.round}-${entry.attackerTaskForceId}-${entry.cardId}-${index}`}
						withBorder
					>
						<Text size="sm">
							R{entry.round}: {CARD_LABELS[entry.cardId] ?? entry.cardId} by{" "}
							{entry.attackerTaskForceId.slice(0, 8)} ({entry.effectType},{" "}
							{entry.resolvedValue})
						</Text>
					</Card>
				))}
			</Stack>

			{engagement.phase === "completed" && (
				<Alert color="green" title="Combat resolved">
					Winner: {engagement.winnerTaskForceId ?? "Draw"}
				</Alert>
			)}
		</Stack>
	);
}
