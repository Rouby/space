import { test as base, expect } from "@playwright/test";
import { getConnection, getDrizzle } from "@space/data";
import {
	games,
	players,
	resources,
	shipComponentResourceCosts,
	shipComponents,
	shipDesignComponents,
	shipDesigns,
	sql,
	starSystemPopulations,
	starSystemResourceDepots,
	starSystems,
	taskForceEngagements,
	taskForceShipDesigns,
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
	resource: [typeof resources.$inferInsert, typeof resources.$inferSelect];
	starSystemResourceDepot: [
		typeof starSystemResourceDepots.$inferInsert,
		typeof starSystemResourceDepots.$inferSelect,
	];
	starSystemPopulation: [
		typeof starSystemPopulations.$inferInsert,
		typeof starSystemPopulations.$inferSelect,
	];
	shipComponent: [
		typeof shipComponents.$inferInsert,
		typeof shipComponents.$inferSelect,
	];
	shipComponentResourceCost: [
		typeof shipComponentResourceCosts.$inferInsert,
		typeof shipComponentResourceCosts.$inferSelect,
	];
	shipDesign: [
		typeof shipDesigns.$inferInsert,
		typeof shipDesigns.$inferSelect,
	];
	shipDesignComponent: [
		typeof shipDesignComponents.$inferInsert,
		typeof shipDesignComponents.$inferSelect,
	];
	taskForce: [typeof taskForces.$inferInsert, typeof taskForces.$inferSelect];
	taskForceEngagement: [
		typeof taskForceEngagements.$inferInsert,
		typeof taskForceEngagements.$inferSelect,
	];
	taskForceShipDesign: [
		typeof taskForceShipDesigns.$inferInsert,
		typeof taskForceShipDesigns.$inferSelect,
	];
};
const Tables = {
	user: users,
	game: games,
	player: players,
	starSystem: starSystems,
	starSystemPopulation: starSystemPopulations,
	resource: resources,
	starSystemResourceDepot: starSystemResourceDepots,
	shipComponent: shipComponents,
	shipComponentResourceCost: shipComponentResourceCosts,
	shipDesign: shipDesigns,
	shipDesignComponent: shipDesignComponents,
	taskForce: taskForces,
	taskForceEngagement: taskForceEngagements,
	taskForceShipDesign: taskForceShipDesigns,
};
type OnlyGameTypes = Pick<
	Types,
	{
		[K in keyof Types]: Types[K][0] extends { gameId: string } ? K : never;
	}[keyof Types]
>;

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
	game: {
		dbo: Types["game"][1];
		hostUser: Types["user"][1];
		joinPlayer: (name: string) => Promise<Types["user"][1]>;
		add: <T extends keyof OnlyGameTypes>(
			model: T,
			data: OnlyGameTypes[T][0],
		) => Promise<OnlyGameTypes[T][1]>;
	};
}>({
	api: [
		async ({ playwright: _, context }, use, _workerInfo) => {
			const drizzle = getDrizzle(await getConnection());

			await use({
				seed: async (model, data) => {
					return (
						drizzle
							.insert(Tables[model])
							// biome-ignore lint/suspicious/noExplicitAny: seeding
							.values(data as any)
							.returning()
							.then((rows) => rows[0])
					);
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
		},
		{ scope: "test" },
	],
	game: [
		async ({ api }, use) => {
			const hostUser = await api.seed("user", {
				email: `host-${Date.now()}@example.com`,
				name: `Host User ${Date.now()}`,
			});

			const game = await api.seed("game", {
				name: `Test Game ${Date.now()}`,
				hostUserId: hostUser.id,
			});

			const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

			await api.seed("player", {
				userId: hostUser.id,
				gameId: game.id,
				color: colors.shift(),
			});

			await use({
				dbo: game,
				hostUser,
				joinPlayer: async (name) => {
					const user = await api.seed("user", {
						email: `${name.toLocaleLowerCase()}-${Date.now()}@example.com`,
						name,
					});

					await api.seed("player", {
						userId: user.id,
						gameId: game.id,
						color: colors.shift(),
					});

					return user;
				},
				add: async (model, data) => {
					const result = await api.seed(model, {
						...data,
						gameId: game.id,
						// biome-ignore lint/suspicious/noExplicitAny: data set
					} as any);

					return result;
				},
			});

			// Cleanup after the test
			const drizzle = getDrizzle(await getConnection());
			await drizzle
				.delete(Tables.game)
				.where(sql`${Tables.game.id} = ${game.id}`);
		},
		{ scope: "test" },
	],
});

export { expect };
