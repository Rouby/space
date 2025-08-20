import { latestVersion } from "@space/data/game-migrations";
import { eq, games, players } from "@space/data/schema";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { setupGalaxy } from "./galaxy.ts";
import { setupResources } from "./resources.ts";
import { setupStartingConditions } from "./startingConditions.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = {
	players: (typeof players.$inferSelect)[];
	ai: {
		completions: {
			create<T = string>(opt: {
				prompt: string;
				parse: (input: string) => T;
			}): Promise<T>;
		};
	};
};

export async function setup() {
	const playersInGame = await drizzle.query.players.findMany({
		where: eq(players.gameId, gameId),
	});

	const ctx: Context = {
		players: playersInGame,
		ai: {
			completions: {
				create: async ({ prompt, parse }) => {
					const response = await fetch(
						"http://192.168.128.1:11434/api/generate",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								model: "gemma3n",
								prompt: prompt.replaceAll("\n", "\\n"),
								stream: false,
								format: "json",
							}),
						},
					);

					const data = (await response.json()) as
						| { done: boolean; response: string }
						| undefined;

					if (!data?.done) {
						throw new Error("AI generation did not complete");
					}

					return parse(data.response);
				},
			},
		},
	};

	await drizzle.transaction(async (tx) => {
		await setupResources(tx, ctx);

		await setupGalaxy(tx, ctx);

		await setupStartingConditions(tx, ctx);

		await tx
			.update(games)
			.set({ setupCompleted: true, version: latestVersion })
			.where(eq(games.id, gameId));

		console.log("Game setup completed");
	});
}
