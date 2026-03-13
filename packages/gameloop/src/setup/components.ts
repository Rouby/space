import { shipComponents } from "@space/data/schema";
import { gameId } from "../config.ts";
import { getDefaultComponents } from "../randomGameContent.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupComponents(tx: Transaction, ctx: Context) {
	console.log("Setting up components...");

	const templates = getDefaultComponents();

	for (const player of ctx.players) {
		await tx.insert(shipComponents).values(
			templates.map((template) => ({
				gameId,
				ownerId: player.userId,
				name: template.name,
				description: template.description,
				layout: template.layout,
				...template.stats,
			})),
		);
	}
}
