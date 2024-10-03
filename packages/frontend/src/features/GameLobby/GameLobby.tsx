import { Button } from "@mantine/core";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "urql";
import { graphql } from "../../gql";

export function GameLobby() {
	const { id } = useParams({
		from: "/_dashboard/_authenticated/games/lobby/$id",
	});

	const [{ data }] = useQuery({
		query: graphql(`query GameLobby($id: ID!) {
      game(id: $id) {
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
		variables: { id },
	});

	const [{ fetching: starting }, startGame] = useMutation(
		graphql(`mutation StartGame($id:ID!) {
    startGame(id: $id) {
      id
      startedAt
    }
  }`),
	);

	const navigate = useNavigate();

	return (
		<div>
			<h1>Game Lobby: {data?.game.name}</h1>

			<ul>
				{data?.game.players.map((player) => (
					<li key={player.id}>{player.user.name}</li>
				))}
			</ul>

			<Button
				onClick={async () => {
					await startGame({ id });

					navigate({ to: "/games/$id", params: { id } });
				}}
				loading={starting}
			>
				Start game
			</Button>
		</div>
	);
}
