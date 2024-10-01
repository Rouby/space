import { DatabaseError, passwords, users } from "@space/data/schema";
import { genSalt, hash } from "bcrypt";
import { createGraphQLError } from "graphql-yoga";
import type { MutationResolvers } from "./../../../types.generated.js";
export const registerWithPassword: NonNullable<
	MutationResolvers["registerWithPassword"]
> = async (_parent, { email, name, password }, ctx) => {
	const passwordHash = await hash(password, await genSalt(10));

	const user = await ctx.drizzle
		.transaction(async (tx) => {
			const user = await tx
				.insert(users)
				.values({
					email,
					name,
				})
				.returning();

			await tx.insert(passwords).values({
				userId: user[0].id,
				hash: passwordHash,
			});

			return user[0];
		})
		.catch((err) => {
			if (err instanceof DatabaseError && err.constraint === "email_idx") {
				throw createGraphQLError("Email already in use");
			}
			throw err;
		});

	return user;
};
