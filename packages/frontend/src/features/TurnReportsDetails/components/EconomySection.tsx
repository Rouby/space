import {
	Accordion,
	Badge,
	Divider,
	Group,
	Progress,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { IconPick } from "@tabler/icons-react";
import { formatInteger, formatUnit } from "../../../format/formatNumber";
import type { TurnReport } from "../types";
import { formatProjectType } from "../utils";

type EconomySectionProps = {
	report: TurnReport;
};

export function EconomySection({ report }: EconomySectionProps) {
	return (
		<Accordion.Item value="economy">
			<Accordion.Control icon={<IconPick size={16} />}>
				<Group justify="space-between" wrap="nowrap" w="100%">
					<Text fw={600}>Economy and Industry</Text>
					<Badge color="lime" variant="light" size="sm">
						{report.miningChanges.length +
							report.industryChanges.length +
							report.industrialProjectCompletions.length}
						events
					</Badge>
				</Group>
			</Accordion.Control>
			<Accordion.Panel>
				<Stack gap="sm">
					<Text size="sm" fw={500}>
						Mining Changes
					</Text>
					{report.miningChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No mining changes.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Star System</Table.Th>
									<Table.Th>Resource</Table.Th>
									<Table.Th>Mined</Table.Th>
									<Table.Th>Depot Qty</Table.Th>
									<Table.Th>Remaining</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.miningChanges.map((change) => (
									<Table.Tr
										key={`${change.starSystem.id}:${change.resource.id}`}
									>
										<Table.Td>{change.starSystem.name}</Table.Td>
										<Table.Td>{change.resource.name}</Table.Td>
										<Table.Td c="green">+{formatUnit(change.mined)}</Table.Td>
										<Table.Td>{formatUnit(change.depotQuantity)}</Table.Td>
										<Table.Td c="dimmed">
											{formatUnit(change.remainingDeposits)}
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Industry Output
					</Text>
					{report.industryChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No industry capability.
						</Text>
					) : (
						<Stack gap="xs">
							{report.industryChanges.map((change) => {
								const utilization =
									change.industryTotal > 0
										? Math.round(
												(change.industryUtilized / change.industryTotal) * 100,
											)
										: 0;

								return (
									<Stack key={`${change.starSystem.id}:utilization`} gap={4}>
										<Group justify="space-between">
											<Text size="xs" c="dimmed">
												{change.starSystem.name}
											</Text>
											<Text size="xs" fw={600}>
												{utilization}% utilized ({change.industryUtilized}/
												{change.industryTotal})
											</Text>
										</Group>
										<Progress
											value={utilization}
											color={utilization >= 90 ? "orange" : "blue"}
											radius="xl"
										/>
									</Stack>
								);
							})}
						</Stack>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Industrial Projects Completed
					</Text>
					{report.industrialProjectCompletions.length === 0 ? (
						<Text size="sm" c="dimmed">
							No industrial projects completed this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Star System</Table.Th>
									<Table.Th>Project</Table.Th>
									<Table.Th>Added Industry</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.industrialProjectCompletions.map((completion, idx) => (
									<Table.Tr
										key={`${completion.starSystem.id}:${completion.projectType}:${idx}`}
									>
										<Table.Td>{completion.starSystem.name}</Table.Td>
										<Table.Td>
											{formatProjectType(completion.projectType)}
										</Table.Td>
										<Table.Td c="green">
											+{formatInteger(completion.industryBonus)}
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
