import { eq, games } from "@space/data/schema";
import { parentPort, workerData } from "node:worker_threads";
import { gameId } from "./config.ts";
import { drizzle } from "./db.ts";
import { setup } from "./setup/setup.ts";
import { tick } from "./tick/tick.ts";

parentPort?.on("message", (message) => {
	if (message === "shutdown") {
		console.log("Worker shutting down");
		process.exit();
	}
});

console.log("Worker says hello", workerData);

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

// start game loop
let ticking = false;
setInterval(() => {
	if (ticking) {
		console.warn("Tick took longer than 1s, skipping tick");
		return;
	}
	ticking = true;
	tick()
		.catch((err) => console.error(err))
		.finally(() => {
			ticking = false;
		});
}, 1000);
