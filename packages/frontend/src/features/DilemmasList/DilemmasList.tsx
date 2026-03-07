import { Badge, Table, Text } from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "urql";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { graphql } from "../../gql";

export function DilemmasList() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query DilemmasHistoryList($gameId: ID!) {
				game(id: $gameId) {
					id
					dilemmas {
						id
						title
						question
						choosen
						choices {
							id
							title
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const dilemmas = [...(data?.game?.dilemmas ?? [])].sort((a, b) => {
		const aResolved = Boolean(a.choosen);
		const bResolved = Boolean(b.choosen);

		if (aResolved === bResolved) {
			return a.title.localeCompare(b.title);
		}

		return aResolved ? 1 : -1;
	});

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Title</Table.Th>
					<Table.Th>Question</Table.Th>
					<Table.Th>Status</Table.Th>
					<Table.Th>Choice</Table.Th>
					<Table.Th />
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{dilemmas.map((dilemma) => {
					const selectedChoice = dilemma.choosen
						? dilemma.choices.find((choice) => choice.id === dilemma.choosen)
						: undefined;

					return (
						<Table.Tr key={dilemma.id}>
							<Table.Td>{dilemma.title}</Table.Td>
							<Table.Td>{dilemma.question}</Table.Td>
							<Table.Td>
								<Badge color={selectedChoice ? "teal" : "blue"} variant="light">
									{selectedChoice ? "Resolved" : "Pending"}
								</Badge>
							</Table.Td>
							<Table.Td>
								{selectedChoice ? (
									<Text>{selectedChoice.title}</Text>
								) : (
									<Text c="dimmed">No choice yet</Text>
								)}
							</Table.Td>
							<Table.Td>
								<LinkButton
									to="/games/$id/dilemmas/$dilemmaId"
									params={{ id: gameId, dilemmaId: dilemma.id }}
								>
									{selectedChoice ? "Review" : "Decide"}
								</LinkButton>
							</Table.Td>
						</Table.Tr>
					);
				})}
			</Table.Tbody>
		</Table>
	);
}
