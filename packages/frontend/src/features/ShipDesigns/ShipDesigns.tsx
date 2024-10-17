import { Button, Table, Title } from "@mantine/core";
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
					costs {
						resource {
							id
							name
						}	
						quantity
					}
        }
      }
    }
  }`),
		variables: { gameId },
	});

	return (
		<>
			<Title order={2}>Available ship designs</Title>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Name</Table.Th>
						<Table.Th>Costs</Table.Th>

						<Table.Th w={0} />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data?.game.me?.shipDesigns.map((design) => (
						<Table.Tr key={design.id}>
							<Table.Td>{design.name}</Table.Td>
							<Table.Td>
								{new Intl.ListFormat(undefined, { style: "narrow" }).format(
									design.costs.map(
										(cost) =>
											`${new Intl.NumberFormat(undefined, {
												style: "decimal",
												notation: "compact",
											}).format(cost.quantity)} ${cost.resource.name}`,
									),
								)}
							</Table.Td>

							<Table.Td>
								<Button size="compact-xs" color="red" disabled>
									Decommision
								</Button>
							</Table.Td>
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
