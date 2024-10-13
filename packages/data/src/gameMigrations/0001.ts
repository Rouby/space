import {
	and,
	eq,
	isNotNull,
	resources,
	sql,
	starSystemResourceDiscoveries,
	starSystems,
} from "../schema.ts";
import type { Transaction } from "./index.ts";

export async function migrateFrom0To1(tx: Transaction, gameId: string) {
	await tx
		.update(starSystems)
		.set({ discoverySlots: sql`1 + floor(random() * 4)::int` })
		.where(eq(starSystems.gameId, gameId));

	const playerSystems = await tx
		.update(starSystems)
		.set({ discoverySlots: 5 })
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.returning();

	const [{ id: titaniumId }] = await tx
		.insert(resources)
		.values([
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
		])
		.returning();

	for (const playerSystem of playerSystems) {
		await tx.insert(starSystemResourceDiscoveries).values({
			starSystemId: playerSystem.id,
			resourceId: titaniumId,
			discoveredAt: new Date(),
			remainingDeposits: 1000000,
		});
	}
}
