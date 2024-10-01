import { Button, Table } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useQuery } from "urql";
import { graphql } from "../../gql";

export function GamesList() {
	const [{ data }] = useQuery({
		query: graphql(`
query Games {
  games {
    id
    name
  }
}`),
	});

	return (
		<>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Game</Table.Th>
						<Table.Th>Player</Table.Th>

						<Table.Th w={0} />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.games.map((game) => (
						<Table.Tr key={game.id}>
							<Table.Td>{game.name}</Table.Td>
							<Table.Td>0 / 8</Table.Td>
							<Table.Td>
								<Button
									component={Link}
									to="/games/$id"
									params={{ id: game.id } as never}
								>
									Join
								</Button>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</>
	);
}
