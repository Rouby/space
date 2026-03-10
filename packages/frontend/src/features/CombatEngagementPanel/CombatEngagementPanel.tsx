import { Alert, Badge, Group, Stack, Text, Title } from "@mantine/core";
import { useMemo } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import { CombatTaskForceSummary } from "./CombatTaskForceSummary";
import { CombatPlayerHand } from "./CombatPlayerHand";
import { CombatTimeline } from "./CombatTimeline";

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
							user {
								id
							}
						}
					}
					taskForceB {
						id
						name
						owner {
							id
							name
							user {
								id
							}
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

		if (engagement.taskForceA.owner?.user.id === me.id) {
			return engagement.participantA;
		}
		if (engagement.taskForceB.owner?.user.id === me.id) {
			return engagement.participantB;
		}
		return null;
	}, [engagement, me?.id]);

	const taskForceNameById = useMemo(() => {
		if (!engagement) {
			return new Map<string, string>();
		}

		return new Map([
			[engagement.taskForceA.id, engagement.taskForceA.name],
			[engagement.taskForceB.id, engagement.taskForceB.name],
		]);
	}, [engagement]);

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

	const handleSubmit = async (cardId: string) => {
		await submitAction({
			input: { engagementId: engagement.id, cardId },
		});
		reexecuteQuery({ requestPolicy: "network-only" });
	};

	return (
		<Stack gap="md">
			<Group justify="space-between" align="center">
				<Title order={3}>Combat Engagement</Title>
				<Group gap="xs">
					<Badge variant="light">Round {engagement.currentRound}</Badge>
					<Badge>{engagement.phase}</Badge>
				</Group>
			</Group>

			<CombatTaskForceSummary engagement={engagement} />

			<CombatPlayerHand 
				ownParticipant={ownParticipant} 
				canSubmit={canSubmit} 
				onSubmit={handleSubmit} 
			/>

			<CombatTimeline engagement={engagement} />

			{engagement.phase === "completed" && (
				<Alert color="green" title="Combat resolved">
					Winner:{" "}
					{engagement.winnerTaskForceId
						? (taskForceNameById.get(engagement.winnerTaskForceId) ??
							engagement.winnerTaskForceId)
						: "Draw"}
				</Alert>
			)}
		</Stack>
	);
}
