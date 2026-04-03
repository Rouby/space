import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { ResearchOutcomeData } from "./ResearchPanel.shared";
import {
	categoryMeta,
	signedPercent,
	titleCaseKey,
} from "./ResearchPanel.shared";

type ResearchOutcomesCardProps = {
	researchOutcomes: ResearchOutcomeData[];
};

export function ResearchOutcomesCard({
	researchOutcomes,
}: ResearchOutcomesCardProps) {
	return (
		<Card withBorder>
			<Stack gap="sm">
				<Group justify="space-between" align="center">
					<Text fw={600}>Completed Research Outcomes</Text>
					<Badge variant="light">{researchOutcomes.length}</Badge>
				</Group>

				{researchOutcomes.length > 0 ? (
					<Stack gap="xs">
						{researchOutcomes.map((outcome) => {
							const meta = categoryMeta[outcome.category];
							return (
								<Card key={outcome.id} withBorder radius="md" p="sm">
									<Stack gap={6}>
										<Group justify="space-between" align="center">
											<Group gap="xs">
												<Badge color={meta.color} variant="light" size="xs">
													{meta.label}
												</Badge>
												<Text fw={600}>{titleCaseKey(outcome.outcomeKey)}</Text>
											</Group>
											<Text size="xs" c="dimmed">
												Turn {outcome.turnNumber}
											</Text>
										</Group>

										<Text size="sm" c="dimmed">
											Mode {titleCaseKey(outcome.outcomeMode)} • Stat{" "}
											{titleCaseKey(outcome.stat)} • Modifier{" "}
											{signedPercent(Number(outcome.modifier))}
										</Text>
									</Stack>
								</Card>
							);
						})}
					</Stack>
				) : (
					<Text size="sm" c="dimmed">
						No breakthroughs completed yet. Keep categories in synthesis to
						start unlocking outcomes.
					</Text>
				)}
			</Stack>
		</Card>
	);
}
