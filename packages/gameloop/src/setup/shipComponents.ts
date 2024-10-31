import {
	and,
	eq,
	resources,
	shipComponentResourceCosts,
	shipComponents,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./setup.ts";

export async function setupShipComponents(tx: Transaction, ctx: Context) {
	for (const { userId } of ctx.players) {
		const [
			{ id: nuclearReactorId },
			{ id: plasmaThrustersId },
			{ id: warpDriveId },
			{ id: sensorArrayId },
			{ id: crewQuartersId },
			{ id: supplyStorageId },
			{ id: gatlingGunId },
			{ id: titaniumArmorId },
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
					supplyNeedPassive: "2",
					supplyNeedMovement: "2",
					supplyNeedCombat: "6",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "0",
					supplyNeedMovement: "0",
					supplyNeedCombat: "10",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "0",
					supplyNeedMovement: "10",
					supplyNeedCombat: "0",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "2",
					supplyNeedMovement: "0",
					supplyNeedCombat: "2",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "10",
					supplyNeedMovement: "0",
					supplyNeedCombat: "0",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "2",
					supplyNeedMovement: "0",
					supplyNeedCombat: "0",

					structuralIntegrity: "10",
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
					supplyNeedPassive: "0",
					supplyNeedMovement: "0",
					supplyNeedCombat: "10",

					weaponAccuracy: "1",
					weaponDamage: "1",
					weaponRange: "1",
					weaponCooldown: "1",
					weaponDeliveryType: "projectile",
					weaponArmorPenetration: "1",
					weaponShieldPenetration: "1",
				},
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

		// TODO: replace with random resource?
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
			{
				shipComponentId: titaniumArmorId,
				resourceId: titaniumId,
				quantity: "100",
			},
		]);
	}
}
