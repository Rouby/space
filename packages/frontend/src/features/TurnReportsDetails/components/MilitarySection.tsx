import {
	Accordion,
	Anchor,
	Badge,
	Divider,
	Group,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { formatInteger } from "../../../format/formatNumber";
import type { TurnReport } from "../types";

type MilitarySectionProps = {
	report: TurnReport;
	gameId: string;
};

export function MilitarySection({ report, gameId }: MilitarySectionProps) {
	return (
		<Accordion.Item value="military">
			<Accordion.Control icon={<IconRocket size={16} />}>
				<Group justify="space-between" wrap="nowrap" w="100%">
					<Text fw={600}>Military</Text>
					<Badge color="orange" variant="light" size="sm">
						{report.taskForceConstructionChanges.length +
							report.taskForceEngagements.length}
						events
					</Badge>
				</Group>
			</Accordion.Control>
			<Accordion.Panel>
				<Stack gap="sm">
					<Text size="sm" fw={500}>
						Task Force Construction
					</Text>
					{report.taskForceConstructionChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No task force construction progress this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Task Force</Table.Th>
									<Table.Th>Star System</Table.Th>
									<Table.Th>Progress</Table.Th>
									<Table.Th>This Turn</Table.Th>
									<Table.Th>Status</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.taskForceConstructionChanges.map((change, idx) => {
									const percent =
										change.total > 0
											? Math.floor((change.newDone / change.total) * 100)
											: 0;

									return (
										<Table.Tr
											key={`${change.taskForce.id}:${change.starSystem.id}:${idx}`}
										>
											<Table.Td>{change.taskForce.name}</Table.Td>
											<Table.Td>{change.starSystem.name}</Table.Td>
											<Table.Td>
												{formatInteger(change.newDone)} /{" "}
												{formatInteger(change.total)} ({percent}%)
											</Table.Td>
											<Table.Td c="green">
												+{formatInteger(change.perTick)}
											</Table.Td>
											<Table.Td c={change.completed ? "green" : "yellow"}>
												{change.completed ? "Completed" : "In progress"}
											</Table.Td>
										</Table.Tr>
									);
								})}
							</Table.Tbody>
						</Table>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Task Force Engagements
					</Text>
					{report.taskForceEngagements.length === 0 ? (
						<Text size="sm" c="dimmed">
							No task force engagements active or resolved this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Engagement</Table.Th>
									<Table.Th>Location</Table.Th>
									<Table.Th>Status</Table.Th>
									<Table.Th>Winner</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.taskForceEngagements.map((engagement) => (
									<Table.Tr key={engagement.engagementId}>
										<Table.Td>
											<Group gap="xs">
												<Text fw={500}>{engagement.taskForceAName}</Text>
												<Text size="xs" c="dimmed">
													vs
												</Text>
												<Text fw={500}>{engagement.taskForceBName}</Text>
												<Anchor
													component={Link}
													to="/games/$id/engagement/$engagementId"
													params={
														{
															id: gameId,
															engagementId: engagement.engagementId,
														} as never
													}
													size="xs"
												>
													Open
												</Anchor>
											</Group>
										</Table.Td>
										<Table.Td c="dimmed">
											({formatInteger(engagement.location.x)},{" "}
											{formatInteger(engagement.location.y)})
										</Table.Td>
										<Table.Td
											c={engagement.status === "resolved" ? "blue" : "yellow"}
										>
											{engagement.status === "resolved"
												? "Resolved"
												: "Unresolved"}
										</Table.Td>
										<Table.Td>
											{engagement.status === "resolved" ? (
												engagement.winnerTaskForceId ===
												engagement.taskForceAId ? (
													engagement.taskForceAName
												) : engagement.winnerTaskForceId ===
													engagement.taskForceBId ? (
													engagement.taskForceBName
												) : (
													"Draw"
												)
											) : (
												<Text size="sm" c="dimmed">
													N/A
												</Text>
											)}
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}
				</Stack>
			</Accordion.Panel>
		</Accordion.Item>
	);
}
