import { expect, test } from "./fixture";

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
