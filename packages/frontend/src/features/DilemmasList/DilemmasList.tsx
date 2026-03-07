import { Table } from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "urql";
import { LinkButton } from "../../components/LinkButton/LinkButton";
import { graphql } from "../../gql";

export function DilemmasList() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query DilemmasList($gameId: ID!) {
				game(id: $gameId) {
					id
					dilemmas {
						id
						title
						question
					}
				}
			}
		`),
		variables: { gameId },
	});

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Title</Table.Th>
					<Table.Th>Question</Table.Th>
					<Table.Th />
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data?.game?.dilemmas.map((dilemma) => (
					<Table.Tr key={dilemma.id}>
						<Table.Td>{dilemma.title}</Table.Td>
						<Table.Td>{dilemma.question}</Table.Td>
						<Table.Td>
							<LinkButton
								to="/games/$id/dilemmas/$dilemmaId"
								params={{ id: gameId, dilemmaId: dilemma.id }}
							>
								View
							</LinkButton>
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
}
