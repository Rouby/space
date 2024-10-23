import {
	and,
	eq,
	isNotNull,
	sql,
	starSystemPopulations,
	starSystems,
} from "../schema.ts";
import type { Transaction } from "./index.ts";

export async function migrateFrom1To2(tx: Transaction, gameId: string) {
	await tx
		.update(starSystems)
		.set({ discoverySlots: sql`1 + floor(random() * 4)::int` })
		.where(eq(starSystems.gameId, gameId));

	const playerSystems = await tx
		.select()
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)));

	for (const playerSystem of playerSystems) {
		await tx.insert(starSystemPopulations).values({
			starSystemId: playerSystem.id,
			amount: 10_000_000_000n,
			allegianceToPlayerId: playerSystem.ownerId,
		});
	}
}
