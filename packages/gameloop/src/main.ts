import { applyMigrations } from "@space/data/game-migrations";
import { eq, games } from "@space/data/schema";
import { parentPort } from "node:worker_threads";
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

// start game loop
const tickRate = game.tickRate;
let ticking = false;
setInterval(() => {
	if (ticking) {
		console.warn(`Tick took longer than ${tickRate}ms; skipping tick`);
		return;
	}
	ticking = true;
	const start = Date.now();
	tick()
		.catch((err) => console.error(err))
		.finally(() => {
			ticking = false;
			const duration = Date.now() - start;
			if (duration > tickRate) console.warn(`Tick took ${duration}ms`);
		});
}, tickRate);
