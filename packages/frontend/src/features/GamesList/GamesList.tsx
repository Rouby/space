import { Badge, Button, Card, Grid, Group, Stack, Tabs } from "@mantine/core";
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
				<Stack gap="md" mt="md">
					{activeGamesFiltered.map((game) => (
						<Card key={game.id} shadow="sm" padding="lg" radius="md" withBorder>
							<Card.Section withBorder inheritPadding py="xs">
								<Group justify="space-between">
									<span style={{ fontWeight: "bold" }}>{game.name}</span>
									<Button
										component={Link}
										to="/games/$id"
										params={{ id: game.id } as never}
										disabled={!game.players.some((p) => p.user.id === me?.id)}
										size="xs"
									>
										Play
									</Button>
								</Group>
							</Card.Section>

							<Grid mt="sm" gutter="sm">
								{game.players.map((player) => (
									<Grid.Col key={player.id} span={6}>
										<Group gap="xs" wrap="nowrap">
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
									</Grid.Col>
								))}
							</Grid>
						</Card>
					))}
				</Stack>
			</Tabs.Panel>

			<Tabs.Panel value="lobby">
				<Stack gap="md" mt="md">
					{lobbyGamesFiltered.map((game) => (
						<Card key={game.id} shadow="sm" padding="lg" radius="md" withBorder>
							<Card.Section withBorder inheritPadding py="xs">
								<Group justify="space-between">
									<span style={{ fontWeight: "bold" }}>{game.name}</span>
									<Group gap="xs">
										<Button
											onClick={() => joinGame({ id: game.id })}
											disabled={
												(joining && operation?.variables?.id !== game.id) ||
												game.players.some((p) => p.user.id === me?.id)
											}
											loading={joining && operation?.variables?.id === game.id}
											size="xs"
										>
											Join
										</Button>
										<Button
											component={Link}
											to="/games/lobby/$id"
											params={{ id: game.id } as never}
											disabled={!game.players.some((p) => p.user.id === me?.id)}
											size="xs"
										>
											Goto
										</Button>
									</Group>
								</Group>
							</Card.Section>

							<Grid mt="sm" gutter="sm">
								{game.players.map((player) => (
									<Grid.Col key={player.id} span={6}>
										<Group gap="xs" wrap="nowrap">
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
									</Grid.Col>
								))}
							</Grid>
						</Card>
					))}
				</Stack>
			</Tabs.Panel>
		</Tabs>
	);
}
