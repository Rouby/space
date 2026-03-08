import { expect, test } from "./fixture";

test.describe.configure({ mode: "serial" });

test("should be able to login and see the game", async ({ page, api }) => {
	const { id: erwinId } = await api.seed("user", {
		email: "erwin@example.com",
		name: "Erwin Beispiel",
	});
	const { id: aliceId } = await api.seed("user", {
		email: "alice@example.com",
		name: "Alice Beispiel",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Test Game",
		hostUserId: erwinId,
	});
	await api.seed("player", {
		gameId,
		userId: erwinId,
		color: "#ff0000",
	});
	await api.seed("player", {
		gameId,
		userId: aliceId,
		color: "#00ff00",
	});
	await api.seed("starSystem", {
		gameId,
		ownerId: erwinId,
		name: "Alpha",
		position: { x: 0, y: 0 },
	});
	await api.seed("starSystem", {
		gameId,
		ownerId: aliceId,
		name: "Beta",
		position: { x: 100, y: 0 },
	});

	await api.login(erwinId);

	await page.goto(`/games/${gameId}`);

	await expect(page).toHaveURL(new RegExp(`/games/${gameId}`));
	await expect(
		page.getByRole("button", { name: /End Turn/i }),
	).toBeVisible();
});

test("denies querying a game for users that are not campaign participants", async ({
	page,
	api,
}) => {
	const { id: ownerId } = await api.seed("user", {
		email: "owner@example.com",
		name: "Owner",
	});
	const { id: intruderId } = await api.seed("user", {
		email: "intruder@example.com",
		name: "Intruder",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Private Game",
		hostUserId: ownerId,
	});
	await api.seed("player", {
		gameId,
		userId: ownerId,
		color: "#112233",
	});

	await api.login(intruderId);

	const response = await page.request.post("/graphql", {
		data: {
			query: "query PrivateGame($id: ID!) { game(id: $id) { id name } }",
			variables: { id: gameId },
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("NOT_AUTHORIZED");
});

test("denies querying star-system details for users outside the game", async ({
	page,
	api,
}) => {
	const { id: ownerId } = await api.seed("user", {
		email: "owner-2@example.com",
		name: "Owner 2",
	});
	const { id: intruderId } = await api.seed("user", {
		email: "intruder-2@example.com",
		name: "Intruder 2",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Fog Of War Game",
		hostUserId: ownerId,
	});
	await api.seed("player", {
		gameId,
		userId: ownerId,
		color: "#abcdef",
	});
	const { id: starSystemId } = await api.seed("starSystem", {
		gameId,
		ownerId,
		name: "Secret System",
		position: { x: 42, y: 42 },
	});

	await api.login(intruderId);

	const response = await page.request.post("/graphql", {
		data: {
			query:
				"query HiddenSystem($id: ID!) { starSystem(id: $id) { id name isVisible owner { id } } }",
			variables: { id: starSystemId },
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("NOT_AUTHORIZED");
});

test("redacts star-system details for authorized players without visibility", async ({
	page,
	api,
}) => {
	const { id: playerAId } = await api.seed("user", {
		email: "player-a@example.com",
		name: "Player A",
	});
	const { id: playerBId } = await api.seed("user", {
		email: "player-b@example.com",
		name: "Player B",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Visibility Boundary Game",
		hostUserId: playerAId,
	});

	await api.seed("player", {
		gameId,
		userId: playerAId,
		color: "#aabbcc",
	});
	await api.seed("player", {
		gameId,
		userId: playerBId,
		color: "#ccbbaa",
	});

	await api.seed("starSystem", {
		gameId,
		ownerId: playerAId,
		name: "Home A",
		position: { x: 0, y: 0 },
	});
	const { id: hiddenSystemId } = await api.seed("starSystem", {
		gameId,
		ownerId: playerBId,
		name: "Hidden B",
		position: { x: 1000, y: 1000 },
	});

	await api.login(playerAId);

	const response = await page.request.post("/graphql", {
		data: {
			query:
				"query MemberHiddenSystem($id: ID!) { starSystem(id: $id) { id isVisible owner { id } discoveryProgress } }",
			variables: { id: hiddenSystemId },
		},
	});
	const payload = await response.json();

	expect(payload.errors).toBeUndefined();
	expect(payload.data?.starSystem?.id).toBe(hiddenSystemId);
	expect(payload.data?.starSystem?.isVisible).toBe(false);
	expect(payload.data?.starSystem?.owner).toBeNull();
	expect(payload.data?.starSystem?.discoveryProgress).toBeNull();
});

test("supports idempotent join requests and shows joined participation state", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host@example.com",
		name: "Host",
	});
	const { id: joinerId } = await api.seed("user", {
		email: "joiner@example.com",
		name: "Joiner",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Join Safety Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#111111",
	});

	await api.login(joinerId);

	const joinMutation = {
		query:
			"mutation Join($id: ID!) { joinGame(id: $id) { id players { user { id } } } }",
		variables: { id: gameId },
	};

	const firstJoin = await page.request.post("/graphql", { data: joinMutation });
	const firstPayload = await firstJoin.json();

	expect(firstPayload.errors).toBeUndefined();
	expect(firstPayload.data?.joinGame?.id).toBe(gameId);

	const secondJoin = await page.request.post("/graphql", { data: joinMutation });
	const secondPayload = await secondJoin.json();

	expect(secondPayload.errors).toBeUndefined();

	const stateResponse = await page.request.post("/graphql", {
		data: {
			query:
				"query JoinedGame($id: ID!) { game(id: $id) { id players { user { id } } } }",
			variables: { id: gameId },
		},
	});
	const statePayload = await stateResponse.json();

	expect(statePayload.errors).toBeUndefined();
	expect(statePayload.data?.game?.players).toHaveLength(2);
	expect(
		statePayload.data?.game?.players.some(
			(player: { user: { id: string } }) => player.user.id === joinerId,
		),
	).toBe(true);
});

test("rejects invalid host settings combinations with typed error codes", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-settings@example.com",
		name: "Host Settings",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Settings Validation Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#223344",
	});

	await api.login(hostId);

	const response = await page.request.post("/graphql", {
		data: {
			query:
				"mutation InvalidSettings($gameId: ID!, $input: UpdateGameSettingsInput!) { updateGameSettings(gameId: $gameId, input: $input) { id } }",
			variables: {
				gameId,
				input: {
					autoEndTurnAfterHoursInactive: 12,
					autoEndTurnEveryHours: 24,
				},
			},
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("INVALID_GAME_SETTINGS");
});

test("persists valid host settings updates for lobby visibility", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-persist@example.com",
		name: "Host Persist",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Settings Persist Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#445566",
	});

	await api.login(hostId);

	const updateResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ValidSettings($gameId: ID!, $input: UpdateGameSettingsInput!) { updateGameSettings(gameId: $gameId, input: $input) { id autoEndTurnAfterHoursInactive autoEndTurnEveryHours } }",
			variables: {
				gameId,
				input: {
					autoEndTurnAfterHoursInactive: 8,
					autoEndTurnEveryHours: 0,
				},
			},
		},
	});
	const updatePayload = await updateResponse.json();

	expect(updatePayload.errors).toBeUndefined();
	expect(updatePayload.data?.updateGameSettings?.autoEndTurnAfterHoursInactive).toBe(
		8,
	);
	expect(updatePayload.data?.updateGameSettings?.autoEndTurnEveryHours).toBe(0);

	const queryResponse = await page.request.post("/graphql", {
		data: {
			query:
				"query SettingsReadback($id: ID!) { game(id: $id) { id autoEndTurnAfterHoursInactive autoEndTurnEveryHours } }",
			variables: { id: gameId },
		},
	});
	const queryPayload = await queryResponse.json();

	expect(queryPayload.errors).toBeUndefined();
	expect(queryPayload.data?.game?.autoEndTurnAfterHoursInactive).toBe(8);
	expect(queryPayload.data?.game?.autoEndTurnEveryHours).toBe(0);
});

test("denies start-game operation for non-participants", async ({ page, api }) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-start@example.com",
		name: "Host Start",
	});
	const { id: intruderId } = await api.seed("user", {
		email: "intruder-start@example.com",
		name: "Intruder Start",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Start Guardrail Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#667788",
	});

	await api.login(intruderId);

	const response = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("NOT_AUTHORIZED");
});

test("denies start-game operation for participants that are not host", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-member-start@example.com",
		name: "Host Member Start",
	});
	const { id: memberId } = await api.seed("user", {
		email: "member-start@example.com",
		name: "Member Start",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Start Host Only Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#667788",
	});
	await api.seed("player", {
		gameId,
		userId: memberId,
		color: "#556677",
	});

	await api.login(memberId);

	const response = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("NOT_AUTHORIZED");
});

test("denies settings updates for participants that are not host", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-member-settings@example.com",
		name: "Host Member Settings",
	});
	const { id: memberId } = await api.seed("user", {
		email: "member-settings@example.com",
		name: "Member Settings",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Settings Host Only Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#223344",
	});
	await api.seed("player", {
		gameId,
		userId: memberId,
		color: "#334455",
	});

	await api.login(memberId);

	const response = await page.request.post("/graphql", {
		data: {
			query:
				"mutation UpdateSettings($gameId: ID!, $input: UpdateGameSettingsInput!) { updateGameSettings(gameId: $gameId, input: $input) { id } }",
			variables: {
				gameId,
				input: {
					autoEndTurnAfterHoursInactive: 8,
					autoEndTurnEveryHours: 0,
				},
			},
		},
	});
	const payload = await response.json();

	expect(payload.errors?.[0]?.extensions?.code).toBe("NOT_AUTHORIZED");
});

test("resolves a turn after all players end and exposes updated monitoring state", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "host-turn-resolution@example.com",
		name: "Host Turn Resolution",
	});
	const { id: memberId } = await api.seed("user", {
		email: "member-turn-resolution@example.com",
		name: "Member Turn Resolution",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Turn Resolution Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#101010",
	});
	await api.seed("player", {
		gameId,
		userId: memberId,
		color: "#202020",
	});

	await api.login(hostId);

	const startResponse = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const startPayload = await startResponse.json();
	expect(startPayload.errors).toBeUndefined();

	const endTurnMutation = {
		query:
			"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
		variables: { expectedTurnNumber: 0, gameId },
	};

	const hostEndTurnResponse = await page.request.post("/graphql", {
		data: endTurnMutation,
	});
	const hostEndTurnPayload = await hostEndTurnResponse.json();
	expect(hostEndTurnPayload.errors).toBeUndefined();

	await api.login(memberId);

	const memberEndTurnResponse = await page.request.post("/graphql", {
		data: endTurnMutation,
	});
	const memberEndTurnPayload = await memberEndTurnResponse.json();
	expect(memberEndTurnPayload.errors).toBeUndefined();

	await api.login(hostId);

	const monitorQuery = {
		query:
			"query Monitor($id: ID!) { game(id: $id) { id turnNumber players { user { id } turnEnded } turnReports(limit: 1) { id turnNumber } } }",
		variables: { id: gameId },
	};

	await expect
		.poll(
			async () => {
				const response = await page.request.post("/graphql", {
					data: monitorQuery,
				});
				const payload = await response.json();

				return {
					errors: payload.errors,
					turnNumber: payload.data?.game?.turnNumber ?? 0,
					reportCount: payload.data?.game?.turnReports?.length ?? 0,
					allPlayersReset:
						(payload.data?.game?.players ?? []).every(
							(player: { turnEnded: boolean | null }) =>
								player.turnEnded === false,
						) ?? false,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			turnNumber: 1,
			reportCount: 1,
			allPlayersReset: true,
		});

	await page.goto(`/games/${gameId}`);
	const endTurnButton = page.getByRole("button", { name: /End Turn/i });
	await expect(endTurnButton).toBeVisible();
	await expect(endTurnButton).toBeEnabled();
});
