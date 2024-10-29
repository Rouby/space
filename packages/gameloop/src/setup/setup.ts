import { latestVersion } from "@space/data/game-migrations";
import { eq, games, players } from "@space/data/schema";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { setupGalaxy } from "./galaxy.ts";
import { setupResources } from "./resources.ts";
import { setupShipComponents } from "./shipComponents.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = { players: (typeof players.$inferSelect)[] };

export async function setup() {
	const playersInGame = await drizzle.query.players.findMany({
		where: eq(players.gameId, gameId),
	});

	const ctx: Context = { players: playersInGame };

	await drizzle.transaction(async (tx) => {
		await setupResources(tx, ctx);

		await setupGalaxy(tx, ctx);

		await setupShipComponents(tx, ctx);

		await tx
			.update(games)
			.set({ setupCompleted: true, version: latestVersion })
			.where(eq(games.id, gameId));

		console.log("Game setup completed");
	});
}
