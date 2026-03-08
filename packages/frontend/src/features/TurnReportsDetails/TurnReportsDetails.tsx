import {
	Card,
	Divider,
	Group,
	ScrollArea,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useParams } from "@tanstack/react-router";
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

	return (
		<Stack p="md" gap="md" h="100%">
			<Title order={3}>Turn Reports</Title>
			<Text size="sm" c="dimmed">
				Detailed end-of-turn summaries for population and mining changes.
			</Text>

			{reports.length === 0 ? (
				<Card withBorder>
					<Text>No reports available yet. End a turn to generate one.</Text>
				</Card>
			) : (
				<ScrollArea h="100%" type="always">
					<Stack gap="sm" pr="sm">
						{reports.map((report) => (
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
										report.populationChanges.map((change) => {
											return (
												<Text size="sm" key={change.population.id}>
													{change.starSystem.name}: +
													{formatInteger(change.growth)} (
													{formatInteger(change.previousAmount)} {"->"}{" "}
													{formatInteger(change.newAmount)})
												</Text>
											);
										})
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
										report.miningChanges.map((change) => {
											return (
												<Text
													size="sm"
													key={`${change.starSystem.id}:${change.resource.id}`}
												>
													{change.starSystem.name} mined{" "}
													{formatUnit(change.mined)} {change.resource.name}{" "}
													(depot: {formatUnit(change.depotQuantity)}, remaining
													deposit: {formatUnit(change.remainingDeposits)})
												</Text>
											);
										})
									)}
								</Stack>
							</Card>
						))}
					</Stack>
				</ScrollArea>
			)}
		</Stack>
	);
}
