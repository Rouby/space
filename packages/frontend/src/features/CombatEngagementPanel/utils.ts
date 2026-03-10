export const CARD_LABELS: Record<string, string> = {
	laser_burst: "Laser Burst",
	target_lock: "Target Lock",
	emergency_repairs: "Emergency Repairs",
	shield_pulse: "Shield Pulse",
	evasive_maneuver: "Evasive Maneuver",
	overcharge_barrage: "Overcharge Barrage",
};

export const CARD_DESCRIPTIONS: Record<string, string> = {
	laser_burst: "Deal moderate damage to the target. Reliable and fast.",
	target_lock: "Buff your next attack for increased precision and damage.",
	emergency_repairs: "Restore a portion of your ship's hull integrity.",
	shield_pulse: "Generate a temporary energy barrier to absorb incoming fire.",
	evasive_maneuver: "Increase your dodge chance against the next enemy attack.",
	overcharge_barrage:
		"Unload all weapons for massive damage, but leaves you vulnerable.",
};

export function getActionColor(entry: {
	effectType: string;
	attackerTaskForceId: string;
	targetTaskForceId: string;
}) {
	if (entry.attackerTaskForceId === entry.targetTaskForceId) {
		return "teal";
	}
	if (entry.effectType === "damage") {
		return "red";
	}
	if (entry.effectType === "buff") {
		return "orange";
	}
	return "blue";
}
