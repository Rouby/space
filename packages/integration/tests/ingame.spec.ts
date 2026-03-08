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

test("configures task force combat deck with MVP validation rules", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "deck-host@example.com",
		name: "Deck Host",
	});
	const { id: intruderId } = await api.seed("user", {
		email: "deck-intruder@example.com",
		name: "Deck Intruder",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Deck Rules Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#aabbcc",
	});
	await api.seed("player", {
		gameId,
		userId: intruderId,
		color: "#ccaa77",
	});

	const { id: taskForceId } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Deck Fleet",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});

	await api.login(hostId);

	const invalidDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id } }",
			variables: {
				input: {
					taskForceId,
					cardIds: ["laser_burst"],
				},
			},
		},
	});
	const invalidDeckPayload = await invalidDeckResponse.json();
	expect(invalidDeckPayload.errors?.[0]?.extensions?.code).toBe(
		"INVALID_DECK_SIZE",
	);

	const duplicateDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id } }",
			variables: {
				input: {
					taskForceId,
					cardIds: [
						"laser_burst",
						"laser_burst",
						"laser_burst",
						"target_lock",
						"target_lock",
						"emergency_repairs",
						"emergency_repairs",
						"shield_pulse",
						"shield_pulse",
						"evasive_maneuver",
						"evasive_maneuver",
						"overcharge_barrage",
					],
				},
			},
		},
	});
	const duplicateDeckPayload = await duplicateDeckResponse.json();
	expect(duplicateDeckPayload.errors?.[0]?.extensions?.code).toBe(
		"DUPLICATE_CARD_LIMIT_EXCEEDED",
	);

	await api.login(intruderId);
	const unauthorizedDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id } }",
			variables: {
				input: {
					taskForceId,
					cardIds: [
						"laser_burst",
						"laser_burst",
						"target_lock",
						"target_lock",
						"emergency_repairs",
						"emergency_repairs",
						"shield_pulse",
						"shield_pulse",
						"evasive_maneuver",
						"evasive_maneuver",
						"overcharge_barrage",
						"overcharge_barrage",
					],
				},
			},
		},
	});
	const unauthorizedDeckPayload = await unauthorizedDeckResponse.json();
	expect(unauthorizedDeckPayload.errors?.[0]?.extensions?.code).toBe(
		"NOT_AUTHORIZED",
	);

	await api.login(hostId);

	const validDeck = [
		"laser_burst",
		"laser_burst",
		"target_lock",
		"target_lock",
		"emergency_repairs",
		"emergency_repairs",
		"shield_pulse",
		"shield_pulse",
		"evasive_maneuver",
		"evasive_maneuver",
		"overcharge_barrage",
		"overcharge_barrage",
	];

	const validDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id combatDeck } }",
			variables: {
				input: {
					taskForceId,
					cardIds: validDeck,
				},
			},
		},
	});
	const validDeckPayload = await validDeckResponse.json();
	expect(validDeckPayload.errors).toBeUndefined();
	expect(validDeckPayload.data?.configureTaskForceCombatDeck?.id).toBe(taskForceId);
	expect(validDeckPayload.data?.configureTaskForceCombatDeck?.combatDeck).toEqual(
		validDeck,
	);
});

test("resolves configured combat decks during turn resolution and applies engagement outcomes", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "combat-flow-host@example.com",
		name: "Combat Flow Host",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Combat Flow Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#8899aa",
	});

	const { id: tfA } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Aggressor A",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});
	const { id: tfB } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Aggressor B",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});

	await api.login(hostId);

	const combatDeck = [
		"target_lock",
		"overcharge_barrage",
		"overcharge_barrage",
		"laser_burst",
		"laser_burst",
		"shield_pulse",
		"shield_pulse",
		"emergency_repairs",
		"emergency_repairs",
		"evasive_maneuver",
		"evasive_maneuver",
		"target_lock",
	];

	for (const taskForceId of [tfA, tfB]) {
		const configureResponse = await page.request.post("/graphql", {
			data: {
				query:
					"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id combatDeck } }",
				variables: {
					input: {
						taskForceId,
						cardIds: combatDeck,
					},
				},
			},
		});
		const configurePayload = await configureResponse.json();
		expect(configurePayload.errors).toBeUndefined();
		expect(configurePayload.data?.configureTaskForceCombatDeck?.id).toBe(taskForceId);
	}

	const startResponse = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const startPayload = await startResponse.json();
	expect(startPayload.errors).toBeUndefined();

	const endTurnResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const endTurnPayload = await endTurnResponse.json();
	expect(endTurnPayload.errors).toBeUndefined();

	await expect
		.poll(
			async () => {
				const stateResponse = await page.request.post("/graphql", {
					data: {
						query:
							"query GameTaskForces($id: ID!) { game(id: $id) { id turnNumber taskForces { id } } }",
						variables: { id: gameId },
					},
				});
				const statePayload = await stateResponse.json();
				return {
					errors: statePayload.errors,
					turnNumber: statePayload.data?.game?.turnNumber,
					taskForceCount: (statePayload.data?.game?.taskForces ?? []).length,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			turnNumber: 1,
			taskForceCount: 1,
		});
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

test("starts colonization as in-progress with distance-based remaining turns", async ({
	page,
	api,
}) => {
	const { id: playerId } = await api.seed("user", {
		email: "colonizer@example.com",
		name: "Colonizer",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Colonization Game",
		hostUserId: playerId,
	});

	await api.seed("player", {
		gameId,
		userId: playerId,
		color: "#123456",
	});

	await api.seed("starSystem", {
		gameId,
		ownerId: playerId,
		name: "Origin",
		position: { x: 0, y: 0 },
	});
	const { id: targetId } = await api.seed("starSystem", {
		gameId,
		ownerId: null,
		name: "Target",
		position: { x: 500, y: 0 },
	});

	await api.login(playerId);

	const startResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation StartColonization($starSystemId: ID!) { startColonization(starSystemId: $starSystemId) { id colonization { turnsRemaining turnsRequired player { id } } } }",
			variables: { starSystemId: targetId },
		},
	});
	const startPayload = await startResponse.json();

	expect(startPayload.errors).toBeUndefined();
	expect(startPayload.data?.startColonization?.id).toBe(targetId);
	expect(
		startPayload.data?.startColonization?.colonization?.player?.id,
	).toContain(playerId);
	expect(startPayload.data?.startColonization?.colonization?.turnsRequired).toBe(
		4,
	);
	expect(
		startPayload.data?.startColonization?.colonization?.turnsRemaining,
	).toBe(4);
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

test("constructs a fleet and applies move orders on turn resolution", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "fleet-host@example.com",
		name: "Fleet Host",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Fleet Movement Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#ff00ff",
	});

	const { id: originStarSystemId } = await api.seed("starSystem", {
		gameId,
		ownerId: hostId,
		name: "Fleet Origin",
		position: { x: 0, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
	});

	const { id: resourceId } = await api.seed("resource", {
		gameId,
		name: "Construction Metal",
		kind: "metal",
		description: "Metal used for ship construction",
		discoveryWeight: 1,
	});

	await api.seed("starSystemResourceDepot", {
		starSystemId: originStarSystemId,
		resourceId,
		quantity: "100",
	});

	const { id: shipComponentId } = await api.seed("shipComponent", {
		gameId,
		ownerId: hostId,
		name: "Hull",
		description: "Basic hull",
		layout: "core",
		supplyNeedPassive: "0",
		supplyNeedMovement: "0",
		supplyNeedCombat: "0",
		powerNeed: "0",
		crewNeed: "0",
		constructionCost: "10",
		supplyCapacity: null,
		powerGeneration: null,
		crewCapacity: null,
		ftlSpeed: null,
		zoneOfControl: null,
		sensorRange: null,
		structuralIntegrity: "10",
		thruster: null,
		sensorPrecision: null,
		armorThickness: null,
		armorEffectivenessAgainst: null,
		shieldStrength: null,
		shieldEffectivenessAgainst: null,
		weaponDamage: null,
		weaponCooldown: null,
		weaponRange: null,
		weaponArmorPenetration: null,
		weaponShieldPenetration: null,
		weaponAccuracy: null,
		weaponDeliveryType: null,
	});

	await api.seed("shipComponentResourceCost", {
		shipComponentId,
		resourceId,
		quantity: "10",
	});

	const { id: shipDesignId } = await api.seed("shipDesign", {
		gameId,
		ownerId: hostId,
		name: "Scout",
		description: "Scout design",
		decommissioned: false,
	});

	await api.seed("shipDesignComponent", {
		shipDesignId,
		shipComponentId,
		column: 0,
		row: 0,
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

	const constructResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Construct($input: ConstructTaskForceInput!) { constructTaskForce(input: $input) { id name position } }",
			variables: {
				input: {
					starSystemId: originStarSystemId,
					shipDesignId,
					name: "Alpha Fleet",
				},
			},
		},
	});
	const constructPayload = await constructResponse.json();

	expect(constructPayload.errors).toBeUndefined();
	const taskForceId = constructPayload.data?.constructTaskForce?.id as string;
	expect(taskForceId).toBeTruthy();

	const orderResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Order($id: ID!, $orders: [TaskForceOrderInput!]!, $queue: Boolean) { orderTaskForce(id: $id, orders: $orders, queue: $queue) { id } }",
			variables: {
				id: taskForceId,
				queue: false,
				orders: [{ move: { destination: { x: 100, y: 0 } } }],
			},
		},
	});
	const orderPayload = await orderResponse.json();
	expect(orderPayload.errors).toBeUndefined();

	const endTurnResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const endTurnPayload = await endTurnResponse.json();
	expect(endTurnPayload.errors).toBeUndefined();

	const taskForceQuery = {
		query:
			"query TaskForces($id: ID!) { game(id: $id) { id taskForces { id position } } }",
		variables: { id: gameId },
	};

	await expect
		.poll(
			async () => {
				const response = await page.request.post("/graphql", {
					data: taskForceQuery,
				});
				const payload = await response.json();
				const taskForce = (payload.data?.game?.taskForces ?? []).find(
					(tf: { id: string }) => tf.id === taskForceId,
				);

				return {
					errors: payload.errors,
					position: taskForce?.position,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			position: { x: 100, y: 0 },
		});
});

test("denies unauthorized fleet mutation and keeps hidden movement details private", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "fleet-privacy-host@example.com",
		name: "Fleet Privacy Host",
	});
	const { id: rivalId } = await api.seed("user", {
		email: "fleet-privacy-rival@example.com",
		name: "Fleet Privacy Rival",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Fleet Privacy Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#ff00ff",
	});
	await api.seed("player", {
		gameId,
		userId: rivalId,
		color: "#00ffff",
	});

	await api.seed("starSystem", {
		gameId,
		ownerId: hostId,
		name: "Host Origin",
		position: { x: 0, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
	});

	await api.seed("starSystem", {
		gameId,
		ownerId: rivalId,
		name: "Rival Origin",
		position: { x: 5000, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
	});

	const { id: taskForceId } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Hidden Fleet",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});

	await api.login(hostId);

	await api.login(rivalId);

	const unauthorizedOrderResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Order($id: ID!, $orders: [TaskForceOrderInput!]!, $queue: Boolean) { orderTaskForce(id: $id, orders: $orders, queue: $queue) { id } }",
			variables: {
				id: taskForceId,
				queue: false,
				orders: [{ move: { destination: { x: 200, y: 0 } } }],
			},
		},
	});
	const unauthorizedOrderPayload = await unauthorizedOrderResponse.json();
	expect(unauthorizedOrderPayload.errors?.[0]?.extensions?.code).toBe(
		"NOT_AUTHORIZED",
	);

	const hiddenViewResponse = await page.request.post("/graphql", {
		data: {
			query:
				"query HiddenTaskForceView($id: ID!) { game(id: $id) { id taskForces { id position isVisible } } }",
			variables: { id: gameId },
		},
	});
	const hiddenViewPayload = await hiddenViewResponse.json();

	if (hiddenViewPayload.errors?.length) {
		expect(hiddenViewPayload.errors?.[0]?.extensions?.code).toBe(
			"NOT_AUTHORIZED",
		);
		expect(hiddenViewPayload.data?.game).toBeUndefined();
	} else {
		expect(
			(hiddenViewPayload.data?.game?.taskForces ?? []).some(
				(tf: { id: string }) => tf.id === taskForceId,
			),
		).toBe(false);
	}
});
