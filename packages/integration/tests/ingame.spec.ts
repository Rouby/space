import { expect, test } from "./fixture";

test.describe.configure({ mode: "default" });

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

	const disallowedDeckResponse = await page.request.post("/graphql", {
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
						"forbidden_card",
					],
				},
			},
		},
	});
	const disallowedDeckPayload = await disallowedDeckResponse.json();
	expect(disallowedDeckPayload.errors?.[0]?.extensions?.code).toBe(
		"CARD_NOT_ALLOWED",
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
			taskForceCount: 2,
		});
});

test("blocks endTurn when unresolved engagements exist", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "blocked-endturn-host@example.com",
		name: "Blocked EndTurn Host",
	});
	const { id: rivalId } = await api.seed("user", {
		email: "blocked-endturn-rival@example.com",
		name: "Blocked EndTurn Rival",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Blocked EndTurn Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#111111",
	});
	await api.seed("player", {
		gameId,
		userId: rivalId,
		color: "#222222",
	});

	const { id: taskForceAId } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Host Vanguard",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});
	const { id: taskForceBId } = await api.seed("taskForce", {
		gameId,
		ownerId: rivalId,
		name: "Rival Vanguard",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
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

	await api.seed("taskForceEngagement", {
		gameId,
		taskForceIdA: taskForceAId,
		taskForceIdB: taskForceBId,
		ownerIdA: hostId,
		ownerIdB: rivalId,
		position: { x: 0, y: 0 },
		phase: "awaiting_submissions",
		currentRound: 1,
		stateA: {
			taskForceId: taskForceAId,
			hp: 10,
			maxHp: 10,
			hand: [],
			deck: [],
			discard: [],
			nextDamageBonus: 0,
			nextDamageReduction: 0,
		},
		stateB: {
			taskForceId: taskForceBId,
			hp: 10,
			maxHp: 10,
			hand: [],
			deck: [],
			discard: [],
			nextDamageBonus: 0,
			nextDamageReduction: 0,
		},
		roundLog: [],
		startedAtTurn: 0,
		resolvedAtTurn: null,
	});

	const endTurnResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const endTurnPayload = await endTurnResponse.json();

	expect(endTurnPayload.data?.endTurn).not.toBeDefined();
	expect(endTurnPayload.errors?.[0]?.extensions?.code).toBe(
		"UNRESOLVED_ENGAGEMENTS",
	);
	expect(endTurnPayload.errors?.[0]?.extensions?.blockers).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ type: "engagement" }),
		]),
	);
});

test("allows endTurn after engagement actions resolve the battle", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "unblocked-endturn-host@example.com",
		name: "Unblocked EndTurn Host",
	});
	const { id: rivalId } = await api.seed("user", {
		email: "unblocked-endturn-rival@example.com",
		name: "Unblocked EndTurn Rival",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Unblocked EndTurn Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#336699",
	});
	await api.seed("player", {
		gameId,
		userId: rivalId,
		color: "#996633",
	});

	const { id: taskForceAId } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Host Spearhead",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});
	const { id: taskForceBId } = await api.seed("taskForce", {
		gameId,
		ownerId: rivalId,
		name: "Rival Spearhead",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
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

	const engagement = await api.seed("taskForceEngagement", {
		gameId,
		taskForceIdA: taskForceAId,
		taskForceIdB: taskForceBId,
		ownerIdA: hostId,
		ownerIdB: rivalId,
		position: { x: 0, y: 0 },
		phase: "awaiting_submissions",
		currentRound: 1,
		stateA: {
			taskForceId: taskForceAId,
			hp: 10,
			maxHp: 10,
			hand: [],
			deck: [],
			discard: [],
			nextDamageBonus: 0,
			nextDamageReduction: 0,
		},
		stateB: {
			taskForceId: taskForceBId,
			hp: 10,
			maxHp: 10,
			hand: [],
			deck: [],
			discard: [],
			nextDamageBonus: 0,
			nextDamageReduction: 0,
		},
		roundLog: [],
		startedAtTurn: 0,
		resolvedAtTurn: null,
	});

	const blockedResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const blockedPayload = await blockedResponse.json();
	expect(blockedPayload.errors?.[0]?.extensions?.code).toBe(
		"UNRESOLVED_ENGAGEMENTS",
	);

	const submitRetreatAResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation SubmitEngagement($input: SubmitTaskForceEngagementActionInput!) { submitTaskForceEngagementAction(input: $input) { id phase } }",
			variables: {
				input: {
					engagementId: engagement.id,
					action: "RETREAT",
				},
			},
		},
	});
	const submitRetreatAPayload = await submitRetreatAResponse.json();
	expect(submitRetreatAPayload.errors).toBeUndefined();

	await api.login(rivalId);

	const submitRetreatBResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation SubmitEngagement($input: SubmitTaskForceEngagementActionInput!) { submitTaskForceEngagementAction(input: $input) { id phase resolvedAtTurn } }",
			variables: {
				input: {
					engagementId: engagement.id,
					action: "RETREAT",
				},
			},
		},
	});
	const submitRetreatBPayload = await submitRetreatBResponse.json();
	expect(submitRetreatBPayload.errors).toBeUndefined();
	expect(
		submitRetreatBPayload.data?.submitTaskForceEngagementAction?.phase,
	).toBe("completed");

	await api.login(hostId);

	const endTurnResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const endTurnPayload = await endTurnResponse.json();

	expect(endTurnPayload.errors).toBeUndefined();
	expect(endTurnPayload.data?.endTurn?.id).toBe(gameId);
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

test("accumulates colonization pressure passively and projects ETA", async ({
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

	const { id: originId } = await api.seed("starSystem", {
		gameId,
		ownerId: playerId,
		name: "Origin",
		position: { x: 0, y: 0 },
	});
	
	// Add 5B population to get exactly 5 outflow points
	await api.seed("starSystemPopulation", {
		starSystemId: originId,
		allegianceToPlayerId: playerId,
		amount: 5_000_000_000n,
	});
	
	const { id: targetId } = await api.seed("starSystem", {
		gameId,
		ownerId: null,
		name: "Target",
		position: { x: 500, y: 0 },
	});

	await api.login(playerId);

	const startGameResponse = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const startPayload = await startGameResponse.json();
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
				const progressResponse = await page.request.post("/graphql", {
					data: {
						query:
							"query ColonizationProgress($starSystemId: ID!) { starSystem(id: $starSystemId) { id colonization { accumulated pressurePerTurn threshold etaTurns player { id user { id } } } } }",
						variables: { starSystemId: targetId },
					},
				});
				const progressPayload = await progressResponse.json();
				
				const colonization = progressPayload.data?.starSystem?.colonization;

				return {
					errors: progressPayload.errors,
					id: progressPayload.data?.starSystem?.id,
					playerId: colonization?.player?.user?.id,
					accumulated: colonization?.accumulated,
					pressurePerTurn: colonization?.pressurePerTurn,
					threshold: colonization?.threshold,
					etaTurns: colonization?.etaTurns,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			id: targetId,
			playerId,
			accumulated: 5,
			pressurePerTurn: 5,
			threshold: 20,
			etaTurns: 3,
		});
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
		industry: 1,
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
			position: { x: 0, y: 0 },
		});
});

test("returns explicit violation when constructing at unowned system", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "fleet-rules-host@example.com",
		name: "Fleet Rules Host",
	});
	const { id: rivalId } = await api.seed("user", {
		email: "fleet-rules-rival@example.com",
		name: "Fleet Rules Rival",
	});
	const { id: gameId } = await api.seed("game", {
		name: "Fleet Rules Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#f39c12",
	});
	await api.seed("player", {
		gameId,
		userId: rivalId,
		color: "#2980b9",
	});

	const { id: rivalSystemId } = await api.seed("starSystem", {
		gameId,
		ownerId: rivalId,
		name: "Rival Bastion",
		position: { x: 0, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
		industry: 5,
	});

	const { id: shipDesignId } = await api.seed("shipDesign", {
		gameId,
		ownerId: hostId,
		name: "Rules Scout",
		description: "Rules validation scout",
		decommissioned: false,
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
				"mutation Construct($input: ConstructTaskForceInput!) { constructTaskForce(input: $input) { id } }",
			variables: {
				input: {
					starSystemId: rivalSystemId,
					shipDesignId,
					name: "Illicit Fleet",
				},
			},
		},
	});
	const constructPayload = await constructResponse.json();

	expect(constructPayload.data).toBeNull();
	expect(constructPayload.errors).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "INVALID_CONSTRUCTION_ORDER",
					violation: "ORIGIN_NOT_OWNED",
				}),
			}),
		]),
	);
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

test("runs a deterministic multi-turn MVP loop with telemetry checkpoints", async ({
	page,
	api,
}) => {
	const { id: hostId } = await api.seed("user", {
		email: "mvp-loop-host@example.com",
		name: "MVP Loop Host",
	});
	const { id: rivalId } = await api.seed("user", {
		email: "mvp-loop-rival@example.com",
		name: "MVP Loop Rival",
	});
	const { id: gameId } = await api.seed("game", {
		name: "MVP Loop Game",
		hostUserId: hostId,
	});

	await api.seed("player", {
		gameId,
		userId: hostId,
		color: "#d35400",
	});
	await api.seed("player", {
		gameId,
		userId: rivalId,
		color: "#16a085",
	});

	const { id: hostHomeId } = await api.seed("starSystem", {
		gameId,
		ownerId: hostId,
		name: "Host Prime",
		position: { x: 0, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
		industry: 3,
	});
	await api.seed("starSystemPopulation", {
		starSystemId: hostHomeId,
		allegianceToPlayerId: hostId,
		amount: 12_000_000_000n,
	});

	const { id: rivalHomeId } = await api.seed("starSystem", {
		gameId,
		ownerId: rivalId,
		name: "Rival Prime",
		position: { x: 500, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
		industry: 2,
	});
	await api.seed("starSystemPopulation", {
		starSystemId: rivalHomeId,
		allegianceToPlayerId: rivalId,
		amount: 500_000_000n,
	});

	const { id: targetSystemId } = await api.seed("starSystem", {
		gameId,
		ownerId: null,
		name: "Neutral Frontier",
		position: { x: 50, y: 0 },
		discoverySlots: 0,
		discoveryProgress: "0",
		industry: 1,
	});

	const { id: resourceId } = await api.seed("resource", {
		gameId,
		name: "Alloy",
		kind: "metal",
		description: "Construction alloy",
		discoveryWeight: 1,
	});
	await api.seed("starSystemResourceDepot", {
		starSystemId: hostHomeId,
		resourceId,
		quantity: "100",
	});

	const { id: shipComponentId } = await api.seed("shipComponent", {
		gameId,
		ownerId: hostId,
		name: "MVP Hull",
		description: "MVP hull",
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
		structuralIntegrity: "8",
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
		name: "MVP Scout",
		description: "MVP scout design",
		decommissioned: false,
	});
	await api.seed("shipDesignComponent", {
		shipDesignId,
		shipComponentId,
		column: 0,
		row: 0,
	});

	const { id: hostBattleTaskForceId } = await api.seed("taskForce", {
		gameId,
		ownerId: hostId,
		name: "Host Vanguard",
		position: { x: 0, y: 0 },
		movementVector: null,
		orders: [],
	});
	const { id: rivalBattleTaskForceId } = await api.seed("taskForce", {
		gameId,
		ownerId: rivalId,
		name: "Rival Vanguard",
		position: { x: 100, y: 0 },
		movementVector: null,
		orders: [],
	});

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

	await api.login(hostId);

	const startResponse = await page.request.post("/graphql", {
		data: {
			query: "mutation Start($id: ID!) { startGame(id: $id) { id } }",
			variables: { id: gameId },
		},
	});
	const startPayload = await startResponse.json();
	expect(startPayload.errors).toBeUndefined();

	const setStanceResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation SetStance($starSystemId: ID!, $stance: DevelopmentStance!) { setDevelopmentStance(starSystemId: $starSystemId, stance: $stance) { id } }",
			variables: {
				starSystemId: hostHomeId,
				stance: "grow_population",
			},
		},
	});
	const setStancePayload = await setStanceResponse.json();
	expect(setStancePayload.errors).toBeUndefined();

	const queueProjectResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation QueueProject($starSystemId: ID!, $projectType: IndustrialProjectType!) { queueIndustrialProject(starSystemId: $starSystemId, projectType: $projectType) { id } }",
			variables: {
				starSystemId: hostHomeId,
				projectType: "factory_expansion",
			},
		},
	});
	const queueProjectPayload = await queueProjectResponse.json();
	expect(queueProjectPayload.errors).toBeUndefined();

	const constructResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Construct($input: ConstructTaskForceInput!) { constructTaskForce(input: $input) { id name } }",
			variables: {
				input: {
					starSystemId: hostHomeId,
					shipDesignId,
					name: "Builder Fleet",
				},
			},
		},
	});
	const constructPayload = await constructResponse.json();
	expect(constructPayload.errors).toBeUndefined();
	expect(constructPayload.data?.constructTaskForce?.id).toBeTruthy();

	const hostDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id combatDeck } }",
			variables: {
				input: { taskForceId: hostBattleTaskForceId, cardIds: validDeck },
			},
		},
	});
	const hostDeckPayload = await hostDeckResponse.json();
	expect(hostDeckPayload.errors).toBeUndefined();

	await api.login(rivalId);

	const rivalDeckResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation ConfigureDeck($input: ConfigureTaskForceCombatDeckInput!) { configureTaskForceCombatDeck(input: $input) { id combatDeck } }",
			variables: {
				input: { taskForceId: rivalBattleTaskForceId, cardIds: validDeck },
			},
		},
	});
	const rivalDeckPayload = await rivalDeckResponse.json();
	expect(rivalDeckPayload.errors).toBeUndefined();

	const rivalMoveResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Order($id: ID!, $orders: [TaskForceOrderInput!]!, $queue: Boolean) { orderTaskForce(id: $id, orders: $orders, queue: $queue) { id } }",
			variables: {
				id: rivalBattleTaskForceId,
				queue: false,
				orders: [{ move: { destination: { x: 50, y: 0 } } }],
			},
		},
	});
	const rivalMovePayload = await rivalMoveResponse.json();
	expect(rivalMovePayload.errors).toBeUndefined();

	await api.login(hostId);

	const hostMoveResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Order($id: ID!, $orders: [TaskForceOrderInput!]!, $queue: Boolean) { orderTaskForce(id: $id, orders: $orders, queue: $queue) { id } }",
			variables: {
				id: hostBattleTaskForceId,
				queue: false,
				orders: [{ move: { destination: { x: 50, y: 0 } } }],
			},
		},
	});
	const hostMovePayload = await hostMoveResponse.json();
	expect(hostMovePayload.errors).toBeUndefined();

	const endTurnMutation = {
		query:
			"mutation EndTurn($expectedTurnNumber: Int!, $gameId: ID!) { endTurn(gameId: $gameId, expectedTurnNumber: $expectedTurnNumber) { id } }",
	};

	const resolveOpenDilemmas = async () => {
		const dilemmasResponse = await page.request.post("/graphql", {
			data: {
				query:
					"query PendingDilemmas($id: ID!) { game(id: $id) { id dilemmas { id choosen choices { id } } } }",
				variables: { id: gameId },
			},
		});
		const dilemmasPayload = await dilemmasResponse.json();
		expect(dilemmasPayload.errors).toBeUndefined();

		for (const dilemma of dilemmasPayload.data?.game?.dilemmas ?? []) {
			if (dilemma.choosen) {
				continue;
			}

			const defaultChoiceId = dilemma.choices?.[0]?.id;
			expect(defaultChoiceId).toBeTruthy();

			const chooseResponse = await page.request.post("/graphql", {
				data: {
					query:
						"mutation ChooseDilemma($dilemmaId: ID!, $choiceId: ID!) { makeDilemmaChoice(dilemmaId: $dilemmaId, choiceId: $choiceId) { id choosen } }",
					variables: {
						dilemmaId: dilemma.id,
						choiceId: defaultChoiceId,
					},
				},
			});
			const choosePayload = await chooseResponse.json();
			expect(choosePayload.errors).toBeUndefined();
		}
	};

	const hostEndTurn0Response = await page.request.post("/graphql", {
		data: {
			...endTurnMutation,
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const hostEndTurn0Payload = await hostEndTurn0Response.json();
	expect(hostEndTurn0Payload.errors).toBeUndefined();

	await api.login(rivalId);

	const rivalEndTurn0Response = await page.request.post("/graphql", {
		data: {
			...endTurnMutation,
			variables: { expectedTurnNumber: 0, gameId },
		},
	});
	const rivalEndTurn0Payload = await rivalEndTurn0Response.json();
	expect(rivalEndTurn0Payload.errors).toBeUndefined();

	await api.login(hostId);

	const afterTurn0Query = {
		query:
			"query AfterTurn0($gameId: ID!, $targetSystemId: ID!) { game(id: $gameId) { id turnNumber activeTaskForceEngagements { id phase } turnReports(limit: 1) { turnNumber populationChanges { growth } taskForceConstructionChanges { completed } taskForceEngagements { engagementId status } colonizationCompleted { starSystem { id } } } } starSystem(id: $targetSystemId) { id owner { user { id } } } }",
		variables: { gameId, targetSystemId },
	};

	await expect
		.poll(
			async () => {
				const response = await page.request.post("/graphql", {
					data: afterTurn0Query,
				});
				const payload = await response.json();
				const report = payload.data?.game?.turnReports?.[0];

				return {
					errors: payload.errors,
					turnNumber: payload.data?.game?.turnNumber,
					activeEngagements:
						payload.data?.game?.activeTaskForceEngagements?.length ?? 0,
					hasPopulationTelemetry:
						(report?.populationChanges?.length ?? 0) > 0,
					hasConstructionTelemetry:
						(report?.taskForceConstructionChanges?.length ?? 0) > 0,
					hasEngagementTelemetry:
						(report?.taskForceEngagements?.length ?? 0) > 0,
					hasColonizationTelemetry:
						(report?.colonizationCompleted?.length ?? 0) > 0,
					targetOwnerId:
						payload.data?.starSystem?.owner?.user?.id ?? null,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			turnNumber: 1,
			activeEngagements: 1,
			hasPopulationTelemetry: true,
			hasConstructionTelemetry: true,
			hasEngagementTelemetry: true,
			hasColonizationTelemetry: true,
			targetOwnerId: hostId,
		});

	await resolveOpenDilemmas();
	await api.login(rivalId);
	await resolveOpenDilemmas();
	await api.login(hostId);

	const engagementQueryResponse = await page.request.post("/graphql", {
		data: {
			query:
				"query ActiveEngagement($id: ID!) { game(id: $id) { id activeTaskForceEngagements { id } } }",
			variables: { id: gameId },
		},
	});
	const engagementQueryPayload = await engagementQueryResponse.json();
	const activeEngagementId =
		engagementQueryPayload.data?.game?.activeTaskForceEngagements?.[0]?.id;
	expect(activeEngagementId).toBeTruthy();

	const hostRetreatResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Submit($input: SubmitTaskForceEngagementActionInput!) { submitTaskForceEngagementAction(input: $input) { id phase } }",
			variables: {
				input: { engagementId: activeEngagementId, action: "RETREAT" },
			},
		},
	});
	const hostRetreatPayload = await hostRetreatResponse.json();
	expect(hostRetreatPayload.errors).toBeUndefined();

	await api.login(rivalId);

	const rivalRetreatResponse = await page.request.post("/graphql", {
		data: {
			query:
				"mutation Submit($input: SubmitTaskForceEngagementActionInput!) { submitTaskForceEngagementAction(input: $input) { id phase } }",
			variables: {
				input: { engagementId: activeEngagementId, action: "RETREAT" },
			},
		},
	});
	const rivalRetreatPayload = await rivalRetreatResponse.json();
	expect(rivalRetreatPayload.errors).toBeUndefined();
	expect(rivalRetreatPayload.data?.submitTaskForceEngagementAction?.phase).toBe(
		"completed",
	);

	await api.login(hostId);

	await expect
		.poll(
			async () => {
				const response = await page.request.post("/graphql", {
					data: {
						query:
							"query EngagementCompleted($gameId: ID!, $engagementId: ID!) { game(id: $gameId) { id activeTaskForceEngagements { id } } taskForceEngagement(id: $engagementId) { id phase resolvedAtTurn } }",
						variables: { gameId, engagementId: activeEngagementId },
					},
				});
				const payload = await response.json();

				return {
					errors: payload.errors,
					activeEngagements:
						payload.data?.game?.activeTaskForceEngagements?.length ?? 0,
					engagementPhase: payload.data?.taskForceEngagement?.phase,
					resolvedAtTurn:
						payload.data?.taskForceEngagement?.resolvedAtTurn ?? null,
				};
			},
			{ timeout: 20000 },
		)
		.toMatchObject({
			errors: undefined,
			activeEngagements: 0,
			engagementPhase: "completed",
		});
});
