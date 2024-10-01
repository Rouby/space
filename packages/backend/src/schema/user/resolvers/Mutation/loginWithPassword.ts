import { compare } from "bcrypt";
import { createGraphQLError } from "graphql-yoga";
import { SignJWT } from "jose";
import type { MutationResolvers } from "./../../../types.generated";
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

	ctx.request.cookieStore?.set({
		domain: "localhost",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
		httpOnly: true,
		name: "token",
		sameSite: "strict",
		value: await new SignJWT({ "urn:example:claim": true })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setIssuer("urn:sapce:issuer")
			.setAudience("urn:space:audience")
			.setExpirationTime("2h")
			.sign(
				new TextEncoder().encode(process.env.JWT_SECRET || "electric-kitten"),
			),
	});

	return user;
};
