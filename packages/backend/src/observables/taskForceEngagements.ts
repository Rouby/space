import {
	filter,
	map,
	merge,
	mergeMap,
	raceWith,
	startWith,
	takeUntil,
} from "rxjs";
import { fromGameEvents } from "../workers.ts";

export function taskForceEngagements$({
	initialTaskForces,
	gameId,
	userId,
}: {
	initialTaskForces: { id: string }[];
	gameId: string;
	userId: string;
}) {
	return fromGameEvents(gameId).pipe(
		// collect all appear-events
		filter((event) => event.type === "taskForce:appeared"),
		filter((event) => event.userId === userId),
		map((event) => ({ id: event.id })),
		// and initially feed all visible tfs as "appearing"
		startWith(...initialTaskForces),
		mergeMap((visibleTaskForce) =>
			// for each visible tf, listen for join / leave events
			merge(
				fromGameEvents(gameId).pipe(
					filter(
						(event) => event.type === "taskForceEngagement:taskForceJoined",
					),
					filter((event) => event.taskForceId === visibleTaskForce.id),
					map((event) => ({
						__typename: "TaskForceJoinsEngagementEvent" as const,
						subject: {
							__typename: "TaskForceEngagement" as const,
							id: event.id,
						},
					})),
				),
				fromGameEvents(gameId).pipe(
					filter((event) => event.type === "taskForceEngagement:taskForceLeft"),
					filter((event) => event.taskForceId === visibleTaskForce.id),
					map((event) => ({
						__typename: "TaskForceLeavesEngagementEvent" as const,
						subject: {
							__typename: "TaskForceEngagement" as const,
							id: event.id,
						},
					})),
				),
			).pipe(
				// until the task force disappears or is destroyed
				takeUntil(
					fromGameEvents(gameId).pipe(
						filter((event) => event.type === "taskForce:disappeared"),
						filter((event) => event.id === visibleTaskForce.id),
						filter((event) => event.userId === userId),
						raceWith(
							fromGameEvents(gameId).pipe(
								filter((event) => event.type === "taskForce:destroyed"),
								filter((event) => event.id === visibleTaskForce.id),
							),
						),
					),
				),
			),
		),
	);
}
