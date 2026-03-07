import { expect, test } from "./fixture";

test("landing page renders the core CTA", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", {
			name: /A multiplayer space strategy game of exploration and conquest/i,
		}),
	).toBeVisible();
	await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();
});

test("guest users are redirected to sign in when opening games", async ({
	page,
}) => {
	await page.goto("/games");

	await expect(page).toHaveURL(/\/signin/);
	await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Already have an account? Sign in" }),
	).toBeVisible();
});
