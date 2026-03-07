import { compare } from "bcrypt";
import { createGraphQLError } from "graphql-yoga";
import { domain, generateUserClaims } from "../../../../config.ts";
import type { MutationResolvers } from "./../../../types.generated.js";
import { signToken } from "./token.ts";
export const loginWithPassword: NonNullable<
	MutationResolvers["loginWithPassword"]
> = async (_parent, { email, password }, ctx) => {
	const user = await ctx.drizzle.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
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
			domain,
			expires: expirationTime,
			secure: true,
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
			domain,
			expires: expirationTime,
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			name: "refreshToken",
			value: refreshToken,
		});
		// store refreshToken in database
	}

	return user;
};
