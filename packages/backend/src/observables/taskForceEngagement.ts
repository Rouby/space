import { filter, map } from "rxjs";
import { fromGameEvents } from "../workers.ts";

export function taskForceEngagement$({
	taskForceEngagementId,
	gameId,
	userId,
}: {
	taskForceEngagementId: string;
	gameId: string;
	userId: string;
}) {
	return fromGameEvents(gameId).pipe(
		filter((event) => event.type === "taskForceEngagement:weaponFired"),
		filter((event) => event.id === taskForceEngagementId),
		map((event) => ({
			__typename: "TaskForceEngagementWeaponFiredEvent" as const,

			engagement: {
				__typename: "TaskForceEngagement" as const,
				id: event.id,
			},

			attacker: {
				__typename: "TaskForceShip" as const,
				id: event.attackerShipId,
			},
			target: {
				__typename: "TaskForceShip" as const,
				id: event.targetShipId,
			},
			weapon: {
				__typename: "TaskForceShipComponent" as const,
				id: `${event.weaponComponentId}-${event.weaponComponentPosition}`,
				component: {
					__typename: "ShipComponent" as const,
					id: event.weaponComponentId,
					name: "toberesolved",
				},
			},
			damage: event.damage,
		})),
	);
}
