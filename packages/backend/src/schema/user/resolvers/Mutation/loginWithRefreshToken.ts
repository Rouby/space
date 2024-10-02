import { createGraphQLError } from "graphql-yoga";
import { domain } from "../../../../config.js";
import type { MutationResolvers } from "./../../../types.generated.js";
import { signToken, verifyToken } from "./token.js";
export const loginWithRefreshToken: NonNullable<
	MutationResolvers["loginWithRefreshToken"]
> = async (_parent, _arg, ctx) => {
	const refreshToken = await ctx.request.cookieStore
		?.get({ name: "refreshToken" })
		.then((c) => c?.value);

	if (!refreshToken) {
		throw createGraphQLError("No refresh token found");
	}

	const { sub } = await verifyToken(refreshToken).catch(() => ({ sub: null }));

	if (!sub) {
		throw createGraphQLError("Invalid refresh token");
	}

	const user = await ctx.drizzle.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, sub),
	});

	if (!user) {
		throw createGraphQLError("User not found");
	}

	{
		// 10 minutes
		const expirationTime = new Date(Date.now() + 1000 * 60 * 10);
		const accessToken = await signToken(
			user.id,
			{ "urn:space:claim": true },
			expirationTime,
		);
		ctx.request.cookieStore?.set({
			domain,
			expires: expirationTime,
			httpOnly: false,
			sameSite: "strict",
			name: "accessToken",
			value: accessToken,
		});
	}
	// TODO: refresh token also?

	return user;
};
