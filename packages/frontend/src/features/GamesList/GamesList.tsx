import { Button, Group, Table } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

export function GamesList() {
	const [{ data }] = useQuery({
		query: graphql(`
query Games {
  games {
    id
    name
		startedAt	
		players {
			id
			user {
				id
				name
			}
		}
  }
}`),
	});

	const [{ fetching: joining, operation }, joinGame] = useMutation(
		graphql(`mutation JoinGame($id: ID!) {
		joinGame(id: $id) {
			id
			name
			players {
				id
				user {
					id
					name
				}
			}
		}
	}`),
	);

	const { me } = useAuth();

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
							<Table.Td>{game.players.length} / 8</Table.Td>
							<Table.Td>
								<Group wrap="nowrap">
									<Button
										onClick={() => joinGame({ id: game.id })}
										disabled={
											(joining && operation?.variables.id !== game.id) ||
											game.players.some((p) => p.user.id === me?.id)
										}
										loading={joining && operation?.variables.id === game.id}
									>
										Join
									</Button>
									<Button
										disabled={!game.players.some((p) => p.user.id === me?.id)}
										component={Link}
										to={game.startedAt ? "/games/$id" : "/games/lobby/$id"}
										params={{ id: game.id } as never}
									>
										Goto
									</Button>
								</Group>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</>
	);
}
