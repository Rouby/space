import { eq, shipComponentResourceCosts } from "@space/data/schema";
import type { ShipComponentResolvers } from "./../../types.generated.js";
export const ShipComponent: ShipComponentResolvers = {
	/* Implement ShipComponent resolver logic here */

	constructionCost: ({ constructionCost }, _arg, _ctx) => {
		/* ShipComponent.constructionCost resolver is required because ShipComponent.constructionCost and ShipComponentMapper.constructionCost are not compatible */
		return +constructionCost;
	},
	costs: async (parent, _arg, ctx) => {
		return ctx.drizzle
			.select()
			.from(shipComponentResourceCosts)
			.where(eq(shipComponentResourceCosts.shipComponentId, parent.id));
	},
	powerGeneration: ({ powerGeneration }, _arg, _ctx) => {
		/* ShipComponent.powerGeneration resolver is required because ShipComponent.powerGeneration and ShipComponentMapper.powerGeneration are not compatible */
		return powerGeneration ? +powerGeneration : null;
	},
	crewCapacity: ({ crewCapacity }, _arg, _ctx) => {
		/* ShipComponent.crewCapacity resolver is required because ShipComponent.crewCapacity and ShipComponentMapper.crewCapacity are not compatible */
		return crewCapacity ? +crewCapacity : null;
	},
	supplyCapacity: ({ supplyCapacity }, _arg, _ctx) => {
		/* ShipComponent.supplyCapacity resolver is required because ShipComponent.supplyCapacity and ShipComponentMapper.supplyCapacity are not compatible */
		return supplyCapacity ? +supplyCapacity : null;
	},
	ftlSpeed: ({ ftlSpeed }, _arg, _ctx) => {
		/* ShipComponent.ftlSpeed resolver is required because ShipComponent.ftlSpeed and ShipComponentMapper.ftlSpeed are not compatible */
		return ftlSpeed ? +ftlSpeed : null;
	},
	hullBoost: ({ hullBoost }, _arg, _ctx) => {
		/* ShipComponent.hullBoost resolver is required because ShipComponent.hullBoost and ShipComponentMapper.hullBoost are not compatible */
		return hullBoost ? +hullBoost : null;
	},
	powerNeed: ({ powerNeed }, _arg, _ctx) => {
		/* ShipComponent.powerNeed resolver is required because ShipComponent.powerNeed and ShipComponentMapper.powerNeed are not compatible */
		return +powerNeed;
	},
	supplyNeed: ({ supplyNeed }, _arg, _ctx) => {
		/* ShipComponent.supplyNeed resolver is required because ShipComponent.supplyNeed and ShipComponentMapper.supplyNeed are not compatible */
		return +supplyNeed;
	},
	crewNeed: ({ crewNeed }, _arg, _ctx) => {
		/* ShipComponent.crewNeed resolver is required because ShipComponent.crewNeed and ShipComponentMapper.crewNeed are not compatible */
		return +crewNeed;
	},
	sensorPrecision: ({ sensorPrecision }, _arg, _ctx) => {
		/* ShipComponent.sensorPrecision resolver is required because ShipComponent.sensorPrecision and ShipComponentMapper.sensorPrecision are not compatible */
		return sensorPrecision ? +sensorPrecision : null;
	},
	sensorRange: ({ sensorRange }, _arg, _ctx) => {
		/* ShipComponent.sensorRange resolver is required because ShipComponent.sensorRange and ShipComponentMapper.sensorRange are not compatible */
		return sensorRange ? +sensorRange : null;
	},
	armorThickness: ({ armorThickness }, _arg, _ctx) => {
		/* ShipComponent.armorThickness resolver is required because ShipComponent.armorThickness and ShipComponentMapper.armorThickness are not compatible */
		return armorThickness ? +armorThickness : null;
	},
	shieldStrength: ({ shieldStrength }, _arg, _ctx) => {
		/* ShipComponent.shieldStrength resolver is required because ShipComponent.shieldStrength and ShipComponentMapper.shieldStrength are not compatible */
		return shieldStrength ? +shieldStrength : null;
	},
	thruster: ({ thruster }, _arg, _ctx) => {
		/* ShipComponent.thruster resolver is required because ShipComponent.thruster and ShipComponentMapper.thruster are not compatible */
		return thruster ? +thruster : null;
	},
	zoneOfControl: ({ zoneOfControl }, _arg, _ctx) => {
		/* ShipComponent.zoneOfControl resolver is required because ShipComponent.zoneOfControl and ShipComponentMapper.zoneOfControl are not compatible */
		return zoneOfControl ? +zoneOfControl : null;
	},
	weaponAccuracy: ({ weaponAccuracy }, _arg, _ctx) => {
		/* ShipComponent.weaponAccuracy resolver is required because ShipComponent.weaponAccuracy and ShipComponentMapper.weaponAccuracy are not compatible */
		return weaponAccuracy ? +weaponAccuracy : null;
	},
	weaponCooldown: ({ weaponCooldown }, _arg, _ctx) => {
		/* ShipComponent.weaponCooldown resolver is required because ShipComponent.weaponCooldown and ShipComponentMapper.weaponCooldown are not compatible */
		return weaponCooldown ? +weaponCooldown : null;
	},
	weaponDamage: ({ weaponDamage }, _arg, _ctx) => {
		/* ShipComponent.weaponDamage resolver is required because ShipComponent.weaponDamage and ShipComponentMapper.weaponDamage are not compatible */
		return weaponDamage ? +weaponDamage : null;
	},
	weaponRange: ({ weaponRange }, _arg, _ctx) => {
		/* ShipComponent.weaponRange resolver is required because ShipComponent.weaponRange and ShipComponentMapper.weaponRange are not compatible */
		return weaponRange ? +weaponRange : null;
	},
	weaponArmorPenetration: ({ weaponArmorPenetration }, _arg, _ctx) => {
		/* ShipComponent.weaponArmorPenetration resolver is required because ShipComponent.weaponArmorPenetration and ShipComponentMapper.weaponArmorPenetration are not compatible */
		return weaponArmorPenetration ? +weaponArmorPenetration : null;
	},
	weaponShieldPenetration: ({ weaponShieldPenetration }, _arg, _ctx) => {
		/* ShipComponent.weaponShieldPenetration resolver is required because ShipComponent.weaponShieldPenetration and ShipComponentMapper.weaponShieldPenetration are not compatible */
		return weaponShieldPenetration ? +weaponShieldPenetration : null;
	},
};
