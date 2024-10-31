import {
	and,
	eq,
	players,
	resources,
	shipComponentResourceCosts,
	shipComponents,
	shipDesignComponents,
	shipDesignResourceCosts,
	shipDesigns,
	sql,
} from "../schema.ts";
import type { Transaction } from "./index.ts";

export async function migrateFrom3To4(tx: Transaction, gameId: string) {
	const gamePlayers = await tx
		.select()
		.from(players)
		.where(eq(players.gameId, gameId));

	for (const { userId } of gamePlayers) {
		const [{ id: titaniumArmor }] = await tx
			.insert(shipComponents)
			.values([
				{
					gameId,
					ownerId: userId,
					name: "Titanium Armor",
					description: "Armor made of titanium.",
					constructionCost: "100",
					crewNeed: "0",
					powerNeed: "0",
					supplyNeedPassive: "1",
					supplyNeedMovement: "0",
					supplyNeedCombat: "0",

					armorThickness: "1",
					armorEffectivenessAgainst: [
						{ deliveryType: "projectile", effectiveness: 1 },
						{ deliveryType: "missile", effectiveness: 1 },
						{ deliveryType: "beam", effectiveness: 0.1 },
					],
				},
			])
			.returning();

		const [{ id: titaniumId }] = await tx
			.select()
			.from(resources)
			.where(and(eq(resources.gameId, gameId), eq(resources.name, "Titanium")));

		await tx.insert(shipComponentResourceCosts).values([
			{
				shipComponentId: titaniumArmor,
				resourceId: titaniumId,
				quantity: "100",
			},
		]);

		const playerShipDesigns = await tx
			.select()
			.from(shipDesigns)
			.where(
				and(eq(shipDesigns.gameId, gameId), eq(shipDesigns.ownerId, userId)),
			);

		for (const { id: shipDesignId } of playerShipDesigns) {
			const [{ count }] = await tx
				.select({
					count: sql<number>`count(*)`,
				})
				.from(shipDesignComponents)
				.where(eq(shipDesignComponents.shipDesignId, shipDesignId));

			await tx
				.insert(shipDesignComponents)
				.values([
					{ shipDesignId, shipComponentId: titaniumArmor, position: count },
				]);

			await tx
				.update(shipDesignResourceCosts)
				.set({ quantity: "700" })
				.where(eq(shipDesignResourceCosts.shipDesignId, shipDesignId));
		}
	}
}
