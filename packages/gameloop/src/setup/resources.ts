import { resources } from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupResources(tx: Transaction, ctx: Context) {
	// TODO generate random resources

	await tx.insert(resources).values([
		{
			gameId,
			name: "Titanium",
			kind: "metal",
			description: "A strong and lightweight metal.",
			discoveryWeight: 1,
		},
		{
			gameId,
			name: "Ruby",
			kind: "crystal",
			description: "A precious gemstone.",
			discoveryWeight: 1,
		},
		{
			gameId,
			name: "Helium-3",
			kind: "gas",
			description: "A valuable gas.",
			discoveryWeight: 1,
		},
		{
			gameId,
			name: "Quicksilver",
			kind: "liquid",
			description: "A heavy, high viscosity liquid.",
			discoveryWeight: 1,
		},
		{
			gameId,
			name: "Chitin",
			kind: "biological",
			description: "A tough, lightweight material.",
			discoveryWeight: 1,
		},
	]);
}
