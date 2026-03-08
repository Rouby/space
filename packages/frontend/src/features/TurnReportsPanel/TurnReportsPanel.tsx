import {
	Button,
	Card,
	Divider,
	ScrollArea,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "urql";
import { formatInteger, formatUnit } from "../../format/formatNumber";
import { graphql } from "../../gql";

function compactId(id: string) {
	return id.length <= 8 ? id : `${id.slice(0, 8)}...`;
}

export function TurnReportsPanel() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query TurnReports($gameId: ID!) {
				game(id: $gameId) {
					id
					turnReports(limit: 10) {
						id
						turnNumber
						createdAt
						populationChanges {
							starSystem {
								id
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
							}
							resource {
								id
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

	return (
		<Stack gap="sm" p="sm">
			<Title order={5}>Turn Reports</Title>
			<Button
				component={Link}
				from="/games/$id"
				to="./turn-reports"
				variant="light"
				size="xs"
			>
				Open Detailed Reports
			</Button>
			{reports.length === 0 ? (
				<Text size="sm" c="dimmed">
					No completed turn reports yet.
				</Text>
			) : (
				<ScrollArea.Autosize mah={340} type="always">
					<Stack gap="xs">
						{reports.map((report) => (
							<Card key={report.id} withBorder p="sm">
								<Stack gap={4}>
									<Text fw={600}>Turn {report.turnNumber}</Text>
									<Text size="xs" c="dimmed">
										{report.populationChanges.length} population updates,{" "}
										{report.miningChanges.length} mining updates
									</Text>

									{report.populationChanges.slice(0, 5).map((change) => (
										<Text key={change.population.id} size="xs">
											Pop {compactId(change.population.id)}: +
											{formatInteger(change.growth)} (
											{formatInteger(change.previousAmount)} {"->"}{" "}
											{formatInteger(change.newAmount)})
										</Text>
									))}
									{report.populationChanges.length > 5 && (
										<Text size="xs" c="dimmed">
											+{report.populationChanges.length - 5} more population
											changes
										</Text>
									)}

									<Divider my={4} />

									{report.miningChanges.slice(0, 5).map((change) => (
										<Text
											key={`${change.starSystem.id}:${change.resource.id}`}
											size="xs"
										>
											Mine {compactId(change.resource.id)} at{" "}
											{compactId(change.starSystem.id)}: +
											{formatUnit(change.mined)} (depot{" "}
											{formatUnit(change.depotQuantity)})
										</Text>
									))}
									{report.miningChanges.length > 5 && (
										<Text size="xs" c="dimmed">
											+{report.miningChanges.length - 5} more mining changes
										</Text>
									)}
								</Stack>
							</Card>
						))}
					</Stack>
				</ScrollArea.Autosize>
			)}
		</Stack>
	);
}
