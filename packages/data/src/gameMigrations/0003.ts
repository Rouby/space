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
} from "../schema.ts";
import type { Transaction } from "./index.ts";

export async function migrateFrom2To3(tx: Transaction, gameId: string) {
	const gamePlayers = await tx
		.select()
		.from(players)
		.where(eq(players.gameId, gameId));

	for (const { userId } of gamePlayers) {
		const [
			{ id: nuclearReactorId },
			{ id: plasmaThrustersId },
			{ id: warpDriveId },
			{ id: sensorArrayId },
			{ id: crewQuartersId },
			{ id: supplyStorageId },
			{ id: gatlingGunId },
		] = await tx
			.insert(shipComponents)
			.values([
				{
					gameId,
					ownerId: userId,
					name: "Nuclear Reactor",
					description: "A nuclear reactor that generates power for the ship.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "0",
					supplyNeed: "10",

					powerGeneration: "100",
				},
				{
					gameId,
					ownerId: userId,
					name: "Plasma Thrusters",
					description: "Thrusters that use plasma to propel the ship.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "10",
					supplyNeed: "10",

					thruster: "10",
				},
				{
					gameId,
					ownerId: userId,
					name: "Warp Drive",
					description:
						"A drive that allows the ship to travel faster than light.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "10",
					supplyNeed: "10",

					ftlSpeed: "10",
				},
				{
					gameId,
					ownerId: userId,
					name: "Sensor Array",
					description: "An array of sensors to detect other ships.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "10",
					supplyNeed: "10",

					sensorRange: "100",
					sensorPrecision: "10",
				},
				{
					gameId,
					ownerId: userId,
					name: "Crew Quarters",
					description: "Quarters for the crew to live in.",
					constructionCost: "100",
					crewNeed: "1",
					powerNeed: "10",
					supplyNeed: "10",

					crewCapacity: "100",
				},
				{
					gameId,
					ownerId: userId,
					name: "Supply Storage",
					description: "Storage for supplies.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "10",
					supplyNeed: "1",

					supplyCapacity: "100",
				},
				{
					gameId,
					ownerId: userId,
					name: "Gatling Gun",
					description: "A rapid-fire gun.",
					constructionCost: "100",
					crewNeed: "10",
					powerNeed: "10",
					supplyNeed: "10",

					weaponAccuracy: "1",
					weaponDamage: "1",
					weaponRange: "1",
					weaponCooldown: "1",
					weaponDeliveryType: "projectile",
					weaponArmorPenetration: "1",
					weaponShieldPenetration: "1",
				},
			])
			.returning();

		const [{ id: titaniumId }] = await tx
			.select()
			.from(resources)
			.where(and(eq(resources.gameId, gameId), eq(resources.name, "Titanium")));

		await tx.insert(shipComponentResourceCosts).values([
			{
				shipComponentId: nuclearReactorId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: plasmaThrustersId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: warpDriveId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: sensorArrayId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: crewQuartersId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: supplyStorageId,
				resourceId: titaniumId,
				quantity: "100",
			},
			{
				shipComponentId: gatlingGunId,
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
			await tx.insert(shipDesignComponents).values([
				{ shipDesignId, shipComponentId: nuclearReactorId },
				{ shipDesignId, shipComponentId: plasmaThrustersId },
				{ shipDesignId, shipComponentId: warpDriveId },
				{ shipDesignId, shipComponentId: sensorArrayId },
				{ shipDesignId, shipComponentId: crewQuartersId },
				{ shipDesignId, shipComponentId: supplyStorageId },
				{ shipDesignId, shipComponentId: gatlingGunId },
			]);

			await tx
				.update(shipDesignResourceCosts)
				.set({ quantity: "700" })
				.where(eq(shipDesignResourceCosts.shipDesignId, shipDesignId));
		}
	}
}
