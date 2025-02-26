import { Button, ColorInput, Grid, LoadingOverlay } from "@mantine/core";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";

export function GameLobby() {
	const { id } = useParams({
		from: "/_dashboard/_authenticated/games/lobby/$id",
	});

	const { me } = useAuth();

	const [{ data }] = useQuery({
		query: graphql(`query GameLobby($id: ID!) {
      game(id: $id) {
        id
        name
        startedAt
        players {
          id
          color
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

	const [{ fetching: updating }, updatePlayer] = useMutation(
		graphql(`mutation UpdatePlayer($gameId: ID!, $input: UpdatePlayerInput!) {
    updatePlayer(gameId: $gameId, input: $input) {
      id
      color
    }
  }`),
	);

	const navigate = useNavigate();

	const currentPlayer = data?.game.players.find(
		(player) => player.user.id === me?.id,
	);

	const [previewColor, setPreviewColor] = useState<string | null>(null);

	return (
		<div>
			<h1>Game Lobby: {data?.game.name}</h1>

			<Grid>
				{data?.game.players.map((player) => (
					<Grid.Col key={player.id} span={6}>
						<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
							<div
								style={{
									width: 24,
									height: 24,
									borderRadius: "50%",
									backgroundColor:
										player.user.id === me?.id
											? (previewColor ?? player.color)
											: player.color,
								}}
							/>
							<span>{player.user.name}</span>
							{player.user.id === me?.id && !data.game.startedAt && (
								<div style={{ position: "relative" }}>
									<LoadingOverlay
										visible={updating}
										overlayProps={{ blur: 2 }}
									/>
									<ColorInput
										defaultValue={player.color}
										onChange={setPreviewColor}
										onChangeEnd={(color) => {
											updatePlayer({
												gameId: id,
												input: { color },
											});
										}}
									/>
								</div>
							)}
						</div>
					</Grid.Col>
				))}
			</Grid>

			{currentPlayer && (
				<Button
					onClick={async () => {
						await startGame({ id });
						navigate({ to: "/games/$id", params: { id } });
					}}
					loading={starting}
					mt="xl"
				>
					Start game
				</Button>
			)}
		</div>
	);
}
