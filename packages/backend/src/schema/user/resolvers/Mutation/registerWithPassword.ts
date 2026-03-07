import { DatabaseError, passwords, users } from "@space/data/schema";
import { genSalt, hash } from "bcrypt";
import { createGraphQLError } from "graphql-yoga";
import {
	cookieDomain,
	generateUserClaims,
	secureCookies,
} from "../../../../config.ts";
import type { MutationResolvers } from "./../../../types.generated.js";
import { signToken } from "./token.ts";
export const registerWithPassword: NonNullable<
	MutationResolvers["registerWithPassword"]
> = async (_parent, { email, name, password }, ctx) => {
	const normalizedEmail = email.trim().toLowerCase();
	const trimmedName = name.trim();
	const passwordHash = await hash(password, await genSalt(10));

	const user = await ctx.drizzle
		.transaction(async (tx) => {
			const user = await tx
				.insert(users)
				.values({
					email: normalizedEmail,
					name: trimmedName,
				})
				.returning();

			await tx.insert(passwords).values({
				userId: user[0].id,
				hash: passwordHash,
			});

			return user[0];
		})
		.catch((err) => {
			if (
				err instanceof DatabaseError &&
				err.constraint === "users_email_index"
			) {
				throw createGraphQLError("Email already in use");
			}
			throw err;
		});

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
	}

	return user;
};
