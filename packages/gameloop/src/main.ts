import { parentPort } from "node:worker_threads";
import { applyMigrations } from "@space/data/game-migrations";
import { eq, games, players } from "@space/data/schema";
import { gameId } from "./config.ts";
import { drizzle } from "./db.ts";
import { react } from "./react/react.ts";
import { setup } from "./setup/setup.ts";
import { tick } from "./tick/tick.ts";

parentPort?.on("message", (message) => {
	if (message.type === "shutdown") {
		console.log("Worker shutting down");
		process.exit();
	}
	if (message.type === "notify") {
		console.log("Worker received notification");
		react(message.event).catch((err) => {
			console.error("Error occurred while processing event:", err);
		});
	}
});

console.log(`Worker picked up game ${gameId}`);

const game = await drizzle.query.games.findFirst({
	where: eq(games.id, gameId),
});

if (!game) {
	console.log(`Game with id ${gameId} not found`);
	process.exit(1);
}

if (!game.setupCompleted) {
	await setup();
}

await drizzle.transaction((tx) => applyMigrations(tx, gameId));

while (true) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const playersInGame = await drizzle
		.select()
		.from(players)
		.where(eq(players.gameId, gameId));

	if (playersInGame.length === 0) {
		console.log("Game was abandoned, ending worker");
		process.exit(1);
	}

	if (playersInGame.every((player) => player.turnEndedAt)) {
		console.log("All players have ended their turns, proceeding to tick");

		await tick();
	}
}
