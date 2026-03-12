import type { CombatProfileResolvers } from "./../../types.generated.js";
export const CombatProfile: CombatProfileResolvers = {
	hasWeapons: (parent) => parent.hasWeapons,
	hasHeavyWeapons: (parent) => parent.hasHeavyWeapons,
	hasShields: (parent) => parent.hasShields,
	hasThrusters: (parent) => parent.hasThrusters,
	hasSensors: (parent) => parent.hasSensors,
	hasCrew: (parent) => parent.hasCrew,
	eligibleCardIds: (parent) => parent.eligibleCardIds,
};
