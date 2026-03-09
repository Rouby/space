import {
	Card,
	Divider,
	Group,
	Pagination,
	ScrollArea,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "urql";
import { formatInteger, formatUnit } from "../../format/formatNumber";
import { graphql } from "../../gql";

export function TurnReportsDetails() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query TurnReportsDetails($gameId: ID!) {
				game(id: $gameId) {
					id
					turnReports(limit: 40) {
						id
						turnNumber
						createdAt
						populationChanges {
							starSystem {
								id
								name
							}
							population {
								id
							}
							previousAmount
							newAmount
							growth
						}
						miningChanges {
							starSystem {
								id
								name
							}
							resource {
								id
								name
							}
							mined
							remainingDeposits
							depotQuantity
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const reports = data?.game.turnReports ?? [];
	const [activePage, setActivePage] = useState(1);

	// Ensure the active page isn't out of bounds if the reports change
	const validPage = reports.length > 0 ? Math.min(activePage, reports.length) : 1;
	const report = reports[validPage - 1];

	return (
		<Stack p="md" gap="md" h="100%" mah="100%" style={{ overflow: "hidden" }}>
			<Group justify="space-between">
				<div>
					<Title order={3}>Turn Reports</Title>
					<Text size="sm" c="dimmed">
						Detailed end-of-turn summaries for population and mining changes.
					</Text>
				</div>
				{reports.length > 1 && (
					<Pagination
						total={reports.length}
						value={validPage}
						onChange={setActivePage}
						size="sm"
						withEdges
					/>
				)}
			</Group>

			{reports.length === 0 || !report ? (
				<Card withBorder>
					<Text>No reports available yet. End a turn to generate one.</Text>
				</Card>
			) : (
				<ScrollArea h="100%" type="always">
					<Stack gap="sm" pr="sm">
						<Card key={report.id} withBorder>
								<Stack gap="xs">
									<Group justify="space-between" align="baseline">
										<Title order={5}>Turn {report.turnNumber}</Title>
										<Text size="xs" c="dimmed">
											{new Date(report.createdAt).toLocaleString()}
										</Text>
									</Group>

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
														<Table.Td c="green">+{formatInteger(change.growth)}</Table.Td>
														<Table.Td c="dimmed">{formatInteger(change.previousAmount)}</Table.Td>
														<Table.Td>{formatInteger(change.newAmount)}</Table.Td>
													</Table.Tr>
												))}
											</Table.Tbody>
										</Table>
									)}

									<Divider my="xs" />

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
													<Table.Tr key={`${change.starSystem.id}:${change.resource.id}`}>
														<Table.Td>{change.starSystem.name}</Table.Td>
														<Table.Td>{change.resource.name}</Table.Td>
														<Table.Td c="green">+{formatUnit(change.mined)}</Table.Td>
														<Table.Td>{formatUnit(change.depotQuantity)}</Table.Td>
														<Table.Td c="dimmed">{formatUnit(change.remainingDeposits)}</Table.Td>
													</Table.Tr>
												))}
											</Table.Tbody>
										</Table>
									)}
								</Stack>
							</Card>
					</Stack>
				</ScrollArea>
			)}
		</Stack>
	);
}
