import { Button, Table } from "@mantine/core";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "urql";
import { graphql } from "../../gql";

export function ShipDesigns() {
	const { id: gameId } = useParams({
		from: "/games/_authenticated/$id/ship-designs",
	});

	const [{ data }] = useQuery({
		query: graphql(`query ShipDesigns($gameId: ID!) {
    game(id: $gameId) {
      id
      me {
        id
        shipDesigns {
          id
          name
        }
      }
    }
  }`),
		variables: { gameId },
	});

	return (
		<>
			alistofdesigns
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Ship design</Table.Th>

						<Table.Th w={0} />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.game.me?.shipDesigns.map((design) => (
						<Table.Tr key={design.id}>
							<Table.Td>{design.name}</Table.Td>

							<Table.Td>actions</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Link from="/games/$id/ship-designs" to="new">
				<Button>New design</Button>
			</Link>
		</>
	);
}
