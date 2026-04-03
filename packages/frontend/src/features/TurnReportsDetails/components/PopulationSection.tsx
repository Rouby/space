import {
	Accordion,
	Badge,
	Divider,
	Group,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { formatInteger } from "../../../format/formatNumber";
import type { TurnReport } from "../types";

type PopulationSectionProps = {
	report: TurnReport;
};

export function PopulationSection({ report }: PopulationSectionProps) {
	return (
		<Accordion.Item value="population">
			<Accordion.Control icon={<IconUsers size={16} />}>
				<Group justify="space-between" wrap="nowrap" w="100%">
					<Text fw={600}>Population</Text>
					<Badge color="teal" variant="light" size="sm">
						{report.populationChanges.length +
							report.populationMigrations.length}{" "}
						events
					</Badge>
				</Group>
			</Accordion.Control>
			<Accordion.Panel>
				<Stack gap="sm">
					<Text size="sm" fw={500}>
						Population Changes
					</Text>
					{report.populationChanges.length === 0 ? (
						<Text size="sm" c="dimmed">
							No population changes.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Star System</Table.Th>
									<Table.Th>Growth</Table.Th>
									<Table.Th>Previous</Table.Th>
									<Table.Th>New</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.populationChanges.map((change) => (
									<Table.Tr key={change.population.id}>
										<Table.Td>{change.starSystem.name}</Table.Td>
										<Table.Td c="green">
											+{formatInteger(change.growth)}
										</Table.Td>
										<Table.Td c="dimmed">
											{formatInteger(change.previousAmount)}
										</Table.Td>
										<Table.Td>{formatInteger(change.newAmount)}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					)}

					<Divider my="xs" />

					<Text size="sm" fw={500}>
						Population Migration
					</Text>
					{report.populationMigrations.length === 0 ? (
						<Text size="sm" c="dimmed">
							No migration changes.
						</Text>
					) : (
						<Table striped withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>From</Table.Th>
									<Table.Th>To</Table.Th>
									<Table.Th>Allegiance</Table.Th>
									<Table.Th>Migrated</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{report.populationMigrations.map((migration, idx) => (
									<Table.Tr
										key={`${migration.sourceStarSystem.id}:${migration.destinationStarSystem.id}:${migration.allegiancePlayer.id}:${idx}`}
									>
										<Table.Td>{migration.sourceStarSystem.name}</Table.Td>
										<Table.Td>{migration.destinationStarSystem.name}</Table.Td>
										<Table.Td>{migration.allegiancePlayer.name}</Table.Td>
										<Table.Td>{formatInteger(migration.amount)}</Table.Td>
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
