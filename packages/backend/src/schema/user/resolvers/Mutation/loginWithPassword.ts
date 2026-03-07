import { compare } from "bcrypt";
import { sql } from "drizzle-orm";
import { createGraphQLError } from "graphql-yoga";
import {
	cookieDomain,
	generateUserClaims,
	secureCookies,
} from "../../../../config.ts";
import type { MutationResolvers } from "./../../../types.generated.js";
import { signToken } from "./token.ts";
export const loginWithPassword: NonNullable<
	MutationResolvers["loginWithPassword"]
> = async (_parent, { email, password }, ctx) => {
	const normalizedEmail = email.trim().toLowerCase();

	const user = await ctx.drizzle.query.users.findFirst({
		where: (users) => sql`lower(${users.email}) = ${normalizedEmail}`,
		with: {
			password: true,
		},
	});

	if (!user?.password) {
		throw createGraphQLError("User not found");
	}

	if (!(await compare(password, user.password.hash))) {
		throw createGraphQLError("User not found");
	}

	const claims = await generateUserClaims(user);

	{
		// 10 minutes
		const expirationTime = new Date(Date.now() + 1000 * 60 * 10);
		const accessToken = await signToken(user.id, claims, expirationTime);
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
		// 1 year
		const expirationTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
		const refreshToken = await signToken(user.id, {}, expirationTime);
		ctx.request.cookieStore?.set({
			domain: cookieDomain,
			expires: expirationTime,
			secure: secureCookies,
			httpOnly: true,
			sameSite: "strict",
			name: "refreshToken",
			value: refreshToken,
		});
		// store refreshToken in database
	}

	return user;
};
