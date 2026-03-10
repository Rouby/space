import {
	Avatar,
	Badge,
	Card,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Timeline,
} from "@mantine/core";
import type { CombatEngagementPanelQuery } from "../../gql/graphql";
import { CARD_LABELS, getActionColor } from "./utils";

type EngagementType = NonNullable<
	CombatEngagementPanelQuery["taskForceEngagement"]
>;

export function CombatTimeline({ engagement }: { engagement: EngagementType }) {
	const sortedRoundLog = [...engagement.roundLog].sort((a, b) => {
		if (a.round !== b.round) {
			return b.round - a.round;
		}
		return 0;
	});

	const roundTimelineEntries = [
		...new Set(sortedRoundLog.map((entry) => entry.round)),
	]
		.sort((a, b) => b - a)
		.map((round) => {
			const entriesForRound = sortedRoundLog.filter(
				(entry) => entry.round === round,
			);
			const hpByTaskForce = new Map<string, number>();

			for (const entry of entriesForRound) {
				hpByTaskForce.set(entry.attackerTaskForceId, entry.attackerHpAfter);
				hpByTaskForce.set(entry.targetTaskForceId, entry.targetHpAfter);
			}

			return {
				round,
				actionsA: entriesForRound.filter(
					(entry) => entry.attackerTaskForceId === engagement.taskForceA.id,
				),
				actionsB: entriesForRound.filter(
					(entry) => entry.attackerTaskForceId === engagement.taskForceB.id,
				),
				taskForceAHp:
					hpByTaskForce.get(engagement.taskForceA.id) ??
					engagement.participantA.hp,
				taskForceBHp:
					hpByTaskForce.get(engagement.taskForceB.id) ??
					engagement.participantB.hp,
			};
		});

	return (
		<Stack gap="xs">
			<Group justify="space-between" align="center">
				<Text fw={700}>Battle Timeline</Text>
				<Badge variant="light" color="gray">
					{engagement.roundLog.length} events
				</Badge>
			</Group>
			{engagement.roundLog.length === 0 && (
				<Text size="sm" c="dimmed">
					No resolved actions yet.
				</Text>
			)}
			{roundTimelineEntries.length > 0 && (
				<Card withBorder p="md">
					<Timeline active={-1} bulletSize={24} lineWidth={2} color="gray">
						{roundTimelineEntries.map((roundEntry) => (
							<Timeline.Item
								key={`round-${roundEntry.round}`}
								title={
									<Group justify="space-between" align="center">
										<Badge variant="light" color="indigo">
											Round {roundEntry.round}
										</Badge>
									</Group>
								}
							>
								<Stack gap="xs" mt="xs">
									<SimpleGrid cols={{ base: 1, md: 2 }}>
										<Card
											withBorder
											p="xs"
											style={{
												borderColor: "var(--mantine-color-cyan-filled)",
											}}
										>
											<Stack gap={6}>
												<Group justify="space-between" align="center">
													<Text size="sm" fw={700}>
														{engagement.taskForceA.name}
													</Text>
													<Badge variant="light" color="cyan">
														{roundEntry.actionsA.length} card
														{roundEntry.actionsA.length === 1 ? "" : "s"}
													</Badge>
												</Group>
												{roundEntry.actionsA.length === 0 && (
													<Text size="xs" c="dimmed">
														No resolved card.
													</Text>
												)}
												{roundEntry.actionsA.map((entry, index) => {
													const actionColor = getActionColor(entry);

													return (
														<Group
															key={`a-${roundEntry.round}-${index}`}
															gap="xs"
														>
															<Badge 
																size="md" 
																variant="outline" 
																color="cyan"
																leftSection={
																	<Avatar 
																		src={`/images/cards/${entry.cardId}.png`} 
																		alt={entry.cardId}
																		size={16}
																		radius="xl"
																	/>
																}
															>
																{CARD_LABELS[entry.cardId] ?? entry.cardId}
															</Badge>
															<Badge size="xs" color={actionColor}>
																{entry.resolvedValue}
															</Badge>
														</Group>
													);
												})}
											</Stack>
										</Card>

										<Card
											withBorder
											p="xs"
											style={{
												borderColor: "var(--mantine-color-orange-filled)",
											}}
										>
											<Stack gap={6}>
												<Group justify="space-between" align="center">
													<Text size="sm" fw={700}>
														{engagement.taskForceB.name}
													</Text>
													<Badge variant="light" color="orange">
														{roundEntry.actionsB.length} card
														{roundEntry.actionsB.length === 1 ? "" : "s"}
													</Badge>
												</Group>
												{roundEntry.actionsB.length === 0 && (
													<Text size="xs" c="dimmed">
														No resolved card.
													</Text>
												)}
												{roundEntry.actionsB.map((entry, index) => {
													const actionColor = getActionColor(entry);

													return (
														<Group
															key={`b-${roundEntry.round}-${index}`}
															gap="xs"
														>
															<Badge 
																size="md" 
																variant="outline" 
																color="orange"
																leftSection={
																	<Avatar 
																		src={`/images/cards/${entry.cardId}.png`} 
																		alt={entry.cardId}
																		size={16}
																		radius="xl"
																	/>
																}
															>
																{CARD_LABELS[entry.cardId] ?? entry.cardId}
															</Badge>
															<Badge size="xs" color={actionColor}>
																{entry.resolvedValue}
															</Badge>
														</Group>
													);
												})}
											</Stack>
										</Card>
									</SimpleGrid>
								</Stack>
							</Timeline.Item>
						))}
					</Timeline>
				</Card>
			)}
		</Stack>
	);
}
