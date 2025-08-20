import {
	Box,
	Button,
	Collapse,
	ColorInput,
	Grid,
	Group,
	LoadingOverlay,
	SegmentedControl,
	Slider,
	Stack,
	Text,
} from "@mantine/core";
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
        autoEndTurnAfterHoursInactive
        autoEndTurnEveryHours
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

	const [{ fetching: updatingSettings }, updateSettings] = useMutation(
		graphql(`mutation UpdateGameSettings($gameId: ID!, $input: UpdateGameSettingsInput!) {
      updateGameSettings(gameId: $gameId, input: $input) {
        id
        autoEndTurnAfterHoursInactive
        autoEndTurnEveryHours
      }
    }`),
	);

	const navigate = useNavigate();

	const currentPlayer = data?.game.players.find(
		(player) => player.user.id === me?.id,
	);

	const [previewColor, setPreviewColor] = useState<string | null>(null);

	const [autoTurn, setAutoTurn] = useState<
		"disabled" | "inactivity" | "periodic"
	>("disabled");

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

			<h2>Settings</h2>

			<Stack>
				<SegmentedControl
					value={autoTurn}
					onChange={(value) =>
						setAutoTurn(value as "disabled" | "inactivity" | "periodic")
					}
					data={[
						{ value: "disabled", label: "No auto-turns" },
						{ value: "inactivity", label: "Auto-turn after inactivity" },
						{ value: "periodic", label: "Auto-turn every X hours" },
					]}
				/>

				<Collapse in={autoTurn !== "disabled"}>
					<Box>
						{autoTurn === "inactivity" && (
							<Text>Auto end turn after hours of inactivity:</Text>
						)}
						{autoTurn === "periodic" && (
							<Text>Auto end turn every X hours:</Text>
						)}
						<Slider
							domain={[1, 48]}
							restrictToMarks
							label={null}
							marks={[
								{
									value: 1,
									label: "1h",
								},
								{
									value: 2,
									label: "2h",
								},
								{
									value: 4,
									label: "4h",
								},
								{
									value: 8,
									label: "8h",
								},
								{
									value: 12,
									label: "12h",
								},
								{
									value: 24,
									label: "24h",
								},
								{
									value: 48,
									label: "48h",
								},
							]}
							value={
								autoTurn === "inactivity"
									? (data?.game.autoEndTurnAfterHoursInactive ?? 0)
									: (data?.game.autoEndTurnEveryHours ?? 0)
							}
							onChange={(value) => {
								updateSettings({
									gameId: id,
									input:
										autoTurn === "inactivity"
											? {
													autoEndTurnAfterHoursInactive: value,
													autoEndTurnEveryHours: 0,
												}
											: {
													autoEndTurnAfterHoursInactive: 0,
													autoEndTurnEveryHours: value,
												},
								});
							}}
						/>
					</Box>
				</Collapse>
			</Stack>

			<Group justify="end" mt="xl">
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
			</Group>
		</div>
	);
}
