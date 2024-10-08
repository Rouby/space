import { test as base, expect } from "@playwright/test";
import { getConnection, getDrizzle } from "@space/data";
import {
	games,
	players,
	starSystems,
	taskForces,
	users,
} from "@space/data/schema";
import { SignJWT } from "jose";

type Types = {
	user: [typeof users.$inferInsert, typeof users.$inferSelect];
	game: [typeof games.$inferInsert, typeof games.$inferSelect];
	player: [typeof players.$inferInsert, typeof players.$inferSelect];
	starSystem: [
		typeof starSystems.$inferInsert,
		typeof starSystems.$inferSelect,
	];
	taskForce: [typeof taskForces.$inferInsert, typeof taskForces.$inferSelect];
};
const Tables = {
	user: users,
	game: games,
	player: players,
	starSystem: starSystems,
	taskForce: taskForces,
};

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || "electric-kitten",
);

export const test = base.extend<{
	api: {
		seed: <T extends keyof Types>(
			model: T,
			data: Types[T][0],
		) => Promise<Types[T][1]>;
		login: (userId: string) => Promise<void>;
	};
}>({
	api: [
		async ({ playwright, context }, use) => {
			const drizzle = getDrizzle(await getConnection());

			await use({
				seed: async (model, data) => {
					return drizzle
						.insert(Tables[model])
						.values(data)
						.returning()
						.then((rows) => rows[0]);
				},
				login: async (userId) => {
					const expirationTime = new Date(Date.now() + 1000 * 60 * 10);

					const accessToken = await new SignJWT({ "urn:space:claim": true })
						.setProtectedHeader({ alg: "HS256" })
						.setSubject(userId)
						.setIssuedAt()
						.setIssuer("urn:space:issuer")
						.setAudience("urn:space:audience")
						.setExpirationTime(expirationTime)
						.sign(secret);

					await context.addCookies([
						{
							url: "http://127.0.0.1:5173/",
							httpOnly: false,
							sameSite: "Lax",
							name: "accessToken",
							value: accessToken,
						},
					]);
				},
			});

			await drizzle.delete(games);
			await drizzle.delete(users);
		},
		{ scope: "test" },
	],
});

export { expect };
