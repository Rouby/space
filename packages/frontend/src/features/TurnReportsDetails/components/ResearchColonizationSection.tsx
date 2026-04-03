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
import { IconFlask } from "@tabler/icons-react";
import { formatInteger } from "../../../format/formatNumber";
import type { TurnReport } from "../types";
import { numberFromValue } from "../utils";

type ResearchColonizationSectionProps = {
	report: TurnReport;
};

export function ResearchColonizationSection({
	report,
}: ResearchColonizationSectionProps) {
	return (
		<Accordion.Item value="science-colonization">
			<Accordion.Control icon={<IconFlask size={16} />}>
				<Group justify="space-between" wrap="nowrap" w="100%">
					<Text fw={600}>Research and Colonization</Text>
					<Badge color="violet" variant="light" size="sm">
						{report.researchProgressChanges.length +
							report.researchBreakthroughs.length +
							report.colonizationPressureChanges.length +
							report.colonizationCompleted.length}
						events
					</Badge>
				</Group>
			</Accordion.Control>
			<Accordion.Panel>
				<Stack gap="sm">
					<Text size="sm" fw={500}>
						Colonization Pressure
					</Text>
					{report.colonizationPressureChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No colonization pressure changes this turn.
						</Text>
					) : (
						<Stack gap="xs">
							<Table striped withTableBorder withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Star System</Table.Th>
										<Table.Th>Added</Table.Th>
										<Table.Th>Accumulated</Table.Th>
										<Table.Th>Threshold</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{report.colonizationPressureChanges.map((change) => (
										<Table.Tr key={change.starSystem.id}>
											<Table.Td>{change.starSystem.name}</Table.Td>
											<Table.Td c="green">
												+{formatInteger(numberFromValue(change.pressureAdded))}
											</Table.Td>
											<Table.Td>
												{formatInteger(
													numberFromValue(change.accumulatedPressure),
												)}
											</Table.Td>
											<Table.Td>
												{formatInteger(
													numberFromValue(change.pressureThreshold),
												)}
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
							{report.colonizationPressureChanges.map((change) => {
								const accumulatedPressure = numberFromValue(
									change.accumulatedPressure,
								);
								const pressureThreshold = numberFromValue(
									change.pressureThreshold,
								);
								const progress =
									pressureThreshold > 0
										? Math.min(
												100,
												Math.round(
													(accumulatedPressure / pressureThreshold) * 100,
												),
											)
										: 0;

								return (
									<Stack key={`${change.starSystem.id}:colonization`} gap={4}>
										<Group justify="space-between">
											<Text size="xs" c="dimmed">
												{change.starSystem.name}
											</Text>
											<Text size="xs" fw={600}>
												{progress}% to colonization
											</Text>
										</Group>
										<Progress value={progress} color="violet" radius="xl" />
									</Stack>
								);
							})}
						</Stack>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Colonization Completed
					</Text>
					{report.colonizationCompleted.length === 0 ? (
						<Text size="sm" c="dimmed">
							No colonization events completed this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Star System</Table.Th>
									<Table.Th>Accumulated</Table.Th>
									<Table.Th>Threshold</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.colonizationCompleted.map((change) => (
									<Table.Tr key={change.starSystem.id}>
										<Table.Td>{change.starSystem.name}</Table.Td>
										<Table.Td>
											{formatInteger(
												numberFromValue(change.accumulatedPressure),
											)}
										</Table.Td>
										<Table.Td>
											{formatInteger(numberFromValue(change.pressureThreshold))}
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Research Progress
					</Text>
					{report.researchProgressChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No research progress updates this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Category</Table.Th>
									<Table.Th>Momentum</Table.Th>
									<Table.Th>Total</Table.Th>
									<Table.Th>Phase</Table.Th>
									<Table.Th>Changed</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.researchProgressChanges.map((change, idx) => (
									<Table.Tr key={`${change.category}:${idx}`}>
										<Table.Td>{change.category}</Table.Td>
										<Table.Td c="green">+{change.momentumGained}</Table.Td>
										<Table.Td>{change.totalMomentum}</Table.Td>
										<Table.Td>{change.phase}</Table.Td>
										<Table.Td>{change.phaseChanged ? "Yes" : "No"}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Research Breakthroughs
					</Text>
					{report.researchBreakthroughs.length === 0 ? (
						<Text size="sm" c="dimmed">
							No breakthroughs this turn.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Category</Table.Th>
									<Table.Th>Outcome</Table.Th>
									<Table.Th>Mode</Table.Th>
									<Table.Th>Stat</Table.Th>
									<Table.Th>Modifier</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.researchBreakthroughs.map((breakthrough, idx) => (
									<Table.Tr
										key={`${breakthrough.category}:${breakthrough.outcomeKey}:${idx}`}
									>
										<Table.Td>{breakthrough.category}</Table.Td>
										<Table.Td>{breakthrough.outcomeKey}</Table.Td>
										<Table.Td>{breakthrough.outcomeMode}</Table.Td>
										<Table.Td>{breakthrough.stat}</Table.Td>
										<Table.Td>{breakthrough.modifier}</Table.Td>
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
