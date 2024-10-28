export type ShipComponentMapper = {
	id: string;
	name: string;
	description: string;

	// general stats
	supplyNeedPassive: string;
	supplyNeedMovement: string;
	supplyNeedCombat: string;
	powerNeed: string;
	crewNeed: string;
	constructionCost: string;

	supplyCapacity: string | null;
	powerGeneration: string | null;
	crewCapacity: string | null;

	// strategic stats
	ftlSpeed: string | null;
	zoneOfControl: string | null;
	sensorRange: string | null;

	// tactical stats
	hullBoost: string | null;
	thruster: string | null;
	sensorPrecision: string | null;
	armorThickness: string | null;
	armorEffectivenessAgainst:
		| {
				deliveryType: "projectile" | "beam" | "missile" | "instant";
				effectiveness: number;
		  }[]
		| null;
	shieldStrength: string | null;
	shieldEffectivenessAgainst:
		| {
				deliveryType: "projectile" | "beam" | "missile" | "instant";
				effectiveness: number;
		  }[]
		| null;
	weaponDamage: string | null;
	weaponCooldown: string | null;
	weaponRange: string | null;
	weaponArmorPenetration: string | null;
	weaponShieldPenetration: string | null;
	weaponAccuracy: string | null;
	weaponDeliveryType: "projectile" | "beam" | "missile" | "instant" | null;
};
