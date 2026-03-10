import { Card, SimpleGrid, Stack, Text, Progress, Group } from "@mantine/core";
import type { CombatEngagementPanelQuery } from "../../gql/graphql";

type EngagementType = NonNullable<CombatEngagementPanelQuery["taskForceEngagement"]>;

export function CombatTaskForceSummary({
	engagement,
}: {
	engagement: EngagementType;
}) {
	return (
		<SimpleGrid cols={{ base: 1, md: 2 }}>
			<Card withBorder>
				<Stack gap={4}>
					<Group justify="space-between" align="flex-end">
						<Text fw={700}>{engagement.taskForceA.name}</Text>
						<Text size="xs" c="dimmed">
							Deck: {engagement.participantA.deckRemaining}
						</Text>
					</Group>
					<Progress
						value={(engagement.participantA.hp / engagement.participantA.maxHp) * 100}
						color="cyan"
						size="xl"
						striped
						animated={engagement.phase === "awaiting_submissions"}
					/>
					<Text size="sm" ta="center">
						HP {engagement.participantA.hp} / {engagement.participantA.maxHp}
					</Text>
				</Stack>
			</Card>
			<Card withBorder>
				<Stack gap={4}>
					<Group justify="space-between" align="flex-end">
						<Text fw={700}>{engagement.taskForceB.name}</Text>
						<Text size="xs" c="dimmed">
							Deck: {engagement.participantB.deckRemaining}
						</Text>
					</Group>
					<Progress
						value={(engagement.participantB.hp / engagement.participantB.maxHp) * 100}
						color="orange"
						size="xl"
						striped
						animated={engagement.phase === "awaiting_submissions"}
					/>
					<Text size="sm" ta="center">
						HP {engagement.participantB.hp} / {engagement.participantB.maxHp}
					</Text>
				</Stack>
			</Card>
		</SimpleGrid>
	);
}
