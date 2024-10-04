import { starSystems } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupGalaxy(tx: Transaction, ctx: Context) {
	console.log("Setting up galaxy...");

	for (const player of ctx.players) {
		await tx.insert(starSystems).values({
			gameId,
			name: "Sol",
			position: { x: 0, y: 0 },
			ownerId: player.userId,
		});
	}

	return true;
}
