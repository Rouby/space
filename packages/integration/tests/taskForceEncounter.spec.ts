import { expect, test } from "./fixture";

test("should run an encounter", async ({ page, api }) => {
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
	});
	await api.seed("player", {
		gameId,
		userId: aliceId,
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

	await expect(page.getByText("Harriette Spoonlicker")).toBeVisible();
});
