import {
	Anchor,
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
import { Link, useParams } from "@tanstack/react-router";
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
						populationMigrations {
							sourceStarSystem {
								id
								name
							}
							destinationStarSystem {
								id
								name
							}
							allegiancePlayer {
								id
								name
							}
							amount
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
						industryChanges {
							starSystem {
								id
								name
							}
							industryTotal
							industryUtilized
						}
						industrialProjectCompletions {
							starSystem {
								id
								name
							}
							projectType
							industryBonus
						}
						taskForceConstructionChanges {
							taskForce {
								id
								name
							}
							starSystem {
								id
								name
							}
							previousDone
							newDone
							total
							perTick
							completed
						}
						taskForceEngagements {
							engagementId
							status
							taskForceAId
							taskForceBId
							taskForceAName
							taskForceBName
							winnerTaskForceId
							location
						}
						colonizationPressureChanges {
							starSystem {
								id
								name
							}
							pressureAdded
							accumulatedPressure
							pressureThreshold
						}
						colonizationCompleted {
							starSystem {
								id
								name
							}
							accumulatedPressure
							pressureThreshold
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const reports = data?.game.turnReports ?? [];
	const [activePage, setActivePage] = useState(1);

	const formatProjectType = (projectType: string) =>
		projectType
			.split("_")
			.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
			.join(" ");

	// Ensure the active page isn't out of bounds if the reports change
	const validPage =
		reports.length > 0 ? Math.min(activePage, reports.length) : 1;
	const report = reports[validPage - 1];

	return (
		<Stack p="md" gap="md" h="100%" mah="100%" style={{ overflow: "hidden" }}>
			<Group justify="space-between">
				<div>
					<Title order={3}>Turn Reports</Title>
					<Text size="sm" c="dimmed">
						Detailed end-of-turn summaries for population, mining, industry,
						migration, industrial projects, and task force construction.
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
													<Table.Td>
														{migration.destinationStarSystem.name}
													</Table.Td>
													<Table.Td>{migration.allegiancePlayer.name}</Table.Td>
													<Table.Td>{formatInteger(migration.amount)}</Table.Td>
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
												<Table.Tr
													key={`${change.starSystem.id}:${change.resource.id}`}
												>
													<Table.Td>{change.starSystem.name}</Table.Td>
													<Table.Td>{change.resource.name}</Table.Td>
													<Table.Td c="green">
														+{formatUnit(change.mined)}
													</Table.Td>
													<Table.Td>
														{formatUnit(change.depotQuantity)}
													</Table.Td>
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
									<Table striped withTableBorder withColumnBorders>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>Star System</Table.Th>
												<Table.Th>Utilized</Table.Th>
												<Table.Th>Capacity</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{report.industryChanges.map((change) => (
												<Table.Tr key={change.starSystem.id}>
													<Table.Td>{change.starSystem.name}</Table.Td>
													<Table.Td>{change.industryUtilized}</Table.Td>
													<Table.Td>{change.industryTotal}</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
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
											{report.industrialProjectCompletions.map(
												(completion, idx) => (
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
												),
											)}
										</Table.Tbody>
									</Table>
								)}

								<Divider my="xs" />

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
											{report.taskForceConstructionChanges.map(
												(change, idx) => {
													const percent =
														change.total > 0
															? Math.floor(
																	(change.newDone / change.total) * 100,
																)
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
															<Table.Td
																c={change.completed ? "green" : "yellow"}
															>
																{change.completed ? "Completed" : "In progress"}
															</Table.Td>
														</Table.Tr>
													);
												},
											)}
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
														c={
															engagement.status === "resolved"
																? "blue"
																: "yellow"
														}
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
						</Card>
					</Stack>
				</ScrollArea>
			)}
		</Stack>
	);
}
