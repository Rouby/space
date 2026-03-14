import { expect, test } from "./fixture";

function base64urlEncode(value: string) {
	return Buffer.from(value)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

function createUnsignedExpiredJwt(subject: string) {
	const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const payload = base64urlEncode(
		JSON.stringify({ sub: subject, exp: Math.floor(Date.now() / 1000) - 60 }),
	);
	return `${header}.${payload}.invalid-signature`;
}

test("landing page renders the core CTA", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", {
			name: /The async 4X strategy game built for long campaigns/i,
		}),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Start your campaign" }),
	).toBeVisible();
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

test("invalid access token redirects to sign in without crashing", async ({
	page,
	context,
}) => {
	await context.addCookies([
		{
			url: "http://127.0.0.1:5173/",
			httpOnly: false,
			sameSite: "Lax",
			name: "accessToken",
			value: "invalid.jwt.value",
		},
	]);

	await page.goto("/games");

	await expect(page).toHaveURL(/\/signin/);
	await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
});

test("expired access token redirects to sign in", async ({ page, context }) => {
	await context.addCookies([
		{
			url: "http://127.0.0.1:5173/",
			httpOnly: false,
			sameSite: "Lax",
			name: "accessToken",
			value: createUnsignedExpiredJwt("expired-user-id"),
		},
	]);

	await page.goto("/games");

	await expect(page).toHaveURL(/\/signin/);
	await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
});
