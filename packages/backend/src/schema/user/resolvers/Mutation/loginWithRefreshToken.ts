import { createGraphQLError } from "graphql-yoga";
import {
	cookieDomain,
	generateUserClaims,
	secureCookies,
} from "../../../../config.ts";
import type { MutationResolvers } from "./../../../types.generated.js";
import { signToken, verifyToken } from "./token.ts";

type CookieSetterContext = {
	request: {
		cookieStore?: {
			set: (cookie: {
				domain: string | null;
				expires: Date;
				secure: boolean;
				httpOnly: boolean;
				sameSite: "strict";
				name: string;
				value: string;
			}) => void;
		};
	};
};

const clearAuthCookies = (ctx: CookieSetterContext) => {
	const expired = new Date(0);
	ctx.request.cookieStore?.set({
		domain: cookieDomain,
		expires: expired,
		secure: secureCookies,
		httpOnly: false,
		sameSite: "strict",
		name: "accessToken",
		value: "",
	});
	ctx.request.cookieStore?.set({
		domain: cookieDomain,
		expires: expired,
		secure: secureCookies,
		httpOnly: true,
		sameSite: "strict",
		name: "refreshToken",
		value: "",
	});
};

export const loginWithRefreshToken: NonNullable<
	MutationResolvers["loginWithRefreshToken"]
> = async (_parent, _arg, ctx) => {
	const refreshToken = await ctx.request.cookieStore
		?.get({ name: "refreshToken" })
		.then((c) => c?.value);

	if (!refreshToken) {
		throw createGraphQLError("Missing refresh token", {
			extensions: { code: "MISSING_REFRESH_TOKEN" },
		});
	}

	const { sub } = await verifyToken(refreshToken).catch(() => ({ sub: null }));

	if (!sub) {
		clearAuthCookies(ctx);
		throw createGraphQLError("Invalid refresh token", {
			extensions: { code: "INVALID_REFRESH_TOKEN" },
		});
	}

	const user = await ctx.drizzle.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, sub),
	});

	if (!user) {
		clearAuthCookies(ctx);
		throw createGraphQLError("Invalid refresh token", {
			extensions: { code: "INVALID_REFRESH_TOKEN" },
		});
	}

	{
		// 10 minutes
		const expirationTime = new Date(Date.now() + 1000 * 60 * 10);
		const accessToken = await signToken(
			user.id,
			await generateUserClaims(user),
			expirationTime,
		);
		ctx.request.cookieStore?.set({
			domain: cookieDomain,
			expires: expirationTime,
			secure: secureCookies,
			httpOnly: false,
			sameSite: "strict",
			name: "accessToken",
			value: accessToken,
		});
	}
	{
		// 1 year - rotate refresh token on successful re-auth
		const expirationTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
		const nextRefreshToken = await signToken(user.id, {}, expirationTime);
		ctx.request.cookieStore?.set({
			domain: cookieDomain,
			expires: expirationTime,
			secure: secureCookies,
			httpOnly: true,
			sameSite: "strict",
			name: "refreshToken",
			value: nextRefreshToken,
		});
	}

	return user;
};
