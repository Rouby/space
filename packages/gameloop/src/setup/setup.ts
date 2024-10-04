import { eq, games, players } from "@space/data/schema";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { setupGalaxy } from "./galaxy.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = { players: (typeof players.$inferSelect)[] };

export async function setup() {
	const playersInGame = await drizzle.query.players.findMany({
		where: eq(players.gameId, gameId),
	});

	await drizzle.transaction(async (tx) => {
		await setupGalaxy(tx, { players: playersInGame });

		await tx
			.update(games)
			.set({ setupCompleted: true })
			.where(eq(games.id, gameId));

		console.log("Game setup completed");
	});
}
