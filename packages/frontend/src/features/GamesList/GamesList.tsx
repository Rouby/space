import { Badge, Button, Group, Table, Tabs } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import type { GamesQuery } from "../../gql/graphql";

export function GamesList() {
	const [{ data }] = useQuery<GamesQuery>({
		query: graphql(`
			query Games {
				games {
					id
					name
					startedAt
					players {
						id
						name
						color
						user {
							id
							name
						}
					}
				}
			}
		`),
	});

	const [{ fetching: joining, operation }, joinGame] = useMutation(
		graphql(`
			mutation JoinGame($id: ID!) {
				joinGame(id: $id) {
					id
					name
					startedAt
					players {
						id
						name
						color
						user {
							id
							name
						}
					}
				}
			}
		`),
	);

	const { me } = useAuth();

	const activeGames = data?.games ?? [];
	const activeGamesFiltered = activeGames.filter((game) => game.startedAt);
	const lobbyGamesFiltered = activeGames.filter((game) => !game.startedAt);

	return (
		<Tabs defaultValue="active">
			<Tabs.List>
				<Tabs.Tab value="active">
					Active <Badge ml="xs">{activeGamesFiltered.length}</Badge>
				</Tabs.Tab>
				<Tabs.Tab value="lobby">
					Lobby <Badge ml="xs">{lobbyGamesFiltered.length}</Badge>
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="active">
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Game</Table.Th>
							<Table.Th>Players</Table.Th>
							<Table.Th w={0} />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{activeGamesFiltered.map((game) => (
							<Table.Tr key={game.id}>
								<Table.Td>{game.name}</Table.Td>
								<Table.Td>
									{game.players.map((player) => (
										<Group key={player.id} gap="xs" wrap="nowrap">
											<div
												style={{
													width: 24,
													height: 24,
													borderRadius: "50%",
													backgroundColor: player.color,
												}}
											/>
											<span>{player.user.name}</span>
										</Group>
									))}
								</Table.Td>
								<Table.Td>
									<Button
										component={Link}
										to="/games/$id"
										params={{ id: game.id } as never}
										disabled={!game.players.some((p) => p.user.id === me?.id)}
									>
										Play
									</Button>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Tabs.Panel>

			<Tabs.Panel value="lobby">
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Game</Table.Th>
							<Table.Th>Players</Table.Th>
							<Table.Th w={0} />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{lobbyGamesFiltered.map((game) => (
							<Table.Tr key={game.id}>
								<Table.Td>{game.name}</Table.Td>
								<Table.Td>
									{game.players.map((player) => (
										<Group key={player.id} gap="xs" wrap="nowrap">
											<div
												style={{
													width: 24,
													height: 24,
													borderRadius: "50%",
													backgroundColor: player.color,
												}}
											/>
											<span>{player.user.name}</span>
										</Group>
									))}
								</Table.Td>
								<Table.Td>
									<Group wrap="nowrap">
										<Button
											onClick={() => joinGame({ id: game.id })}
											disabled={
												(joining && operation?.variables?.id !== game.id) ||
												game.players.some((p) => p.user.id === me?.id)
											}
											loading={joining && operation?.variables?.id === game.id}
										>
											Join
										</Button>
										<Button
											component={Link}
											to="/games/lobby/$id"
											params={{ id: game.id } as never}
											disabled={!game.players.some((p) => p.user.id === me?.id)}
										>
											Goto
										</Button>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Tabs.Panel>
		</Tabs>
	);
}
