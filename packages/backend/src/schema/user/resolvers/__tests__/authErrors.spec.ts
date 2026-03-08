import { describe, expect, it, vi } from "vitest";
import { loginWithPassword } from "../Mutation/loginWithPassword.js";
import { loginWithRefreshToken } from "../Mutation/loginWithRefreshToken.js";
import * as token from "../Mutation/token.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callLoginWithPassword = resolverFn(loginWithPassword);
const callLoginWithRefreshToken = resolverFn(loginWithRefreshToken);

describe("user auth resolver error handling", () => {
	it("returns user and rotates tokens when refresh token is valid", async () => {
		const cookieSets: Array<{
			name: string;
			value: string;
			httpOnly?: boolean;
		}> = [];

		const verifySpy = vi
			.spyOn(token, "verifyToken")
			.mockResolvedValue({ sub: "user-1" } as never);
		const signSpy = vi
			.spyOn(token, "signToken")
			.mockResolvedValueOnce("next-access-token")
			.mockResolvedValueOnce("next-refresh-token");

		const user = { id: "user-1", email: "user@example.com", name: "User" };
		const ctx = {
			request: {
				cookieStore: {
					get: async () => ({ value: "valid-refresh-token" }),
					set: (cookie: {
						name: string;
						value: string;
						httpOnly?: boolean;
					}) => {
						cookieSets.push(cookie);
					},
				},
			},
			drizzle: {
				query: {
					users: {
						findFirst: async () => user,
					},
				},
			},
		} as unknown as Parameters<typeof callLoginWithRefreshToken>[2];

		const result = await callLoginWithRefreshToken({}, {}, ctx, {} as never);

		expect(result).toMatchObject({ id: "user-1" });
		expect(verifySpy).toHaveBeenCalledWith("valid-refresh-token");
		expect(signSpy).toHaveBeenCalledTimes(2);
		expect(cookieSets.some((cookie) => cookie.name === "accessToken")).toBe(
			true,
		);
		expect(
			cookieSets.some(
				(cookie) => cookie.name === "refreshToken" && cookie.httpOnly,
			),
		).toBe(true);

		verifySpy.mockRestore();
		signSpy.mockRestore();
	});

	it("returns INVALID_CREDENTIALS when user/password lookup fails", async () => {
		const ctx = {
			drizzle: {
				query: {
					users: {
						findFirst: async () => null,
					},
				},
			},
		} as unknown as Parameters<typeof callLoginWithPassword>[2];

		await expect(
			callLoginWithPassword(
				{},
				{ email: "missing@example.com", password: "secret" },
				ctx,
				{} as never,
			),
		).rejects.toMatchObject({
			extensions: { code: "INVALID_CREDENTIALS" },
		});
	});

	it("returns MISSING_REFRESH_TOKEN when refresh cookie is absent", async () => {
		const ctx = {
			request: {
				cookieStore: {
					get: async () => undefined,
				},
			},
		} as unknown as Parameters<typeof callLoginWithRefreshToken>[2];

		await expect(
			callLoginWithRefreshToken({}, {}, ctx, {} as never),
		).rejects.toMatchObject({
			extensions: { code: "MISSING_REFRESH_TOKEN" },
		});
	});

	it("returns INVALID_REFRESH_TOKEN when refresh cookie is invalid", async () => {
		const cookieSets: Array<{ name: string; value: string }> = [];
		const ctx = {
			request: {
				cookieStore: {
					get: async () => ({ value: "definitely-not-a-jwt" }),
					set: (cookie: { name: string; value: string }) => {
						cookieSets.push(cookie);
					},
				},
			},
		} as unknown as Parameters<typeof callLoginWithRefreshToken>[2];

		await expect(
			callLoginWithRefreshToken({}, {}, ctx, {} as never),
		).rejects.toMatchObject({
			extensions: { code: "INVALID_REFRESH_TOKEN" },
		});

		expect(cookieSets.some((cookie) => cookie.name === "accessToken")).toBe(
			true,
		);
		expect(cookieSets.some((cookie) => cookie.name === "refreshToken")).toBe(
			true,
		);
	});
});
