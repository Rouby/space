import {
	concat,
	filter,
	from,
	map,
	merge,
	mergeMap,
	pairwise,
	shareReplay,
	startWith,
	take,
	takeUntil,
} from "rxjs";
import { fromGameEvents } from "../workers.ts";

export function taskForces$({
	initialTaskForces,
	gameId,
	userId,
}: {
	initialTaskForces: {
		id: string;
		position: { x: number; y: number };
		movementVector: { x: number; y: number } | null;
	}[];
	gameId: string;
	userId: string;
}) {
	return fromGameEvents(gameId).pipe(
		// collect all appear-events
		filter((event) => event.type === "taskForce:appeared"),
		filter((event) => event.userId === userId),
		map((event) => ({
			__typename: "PositionableApppearsEvent" as const,
			subject: {
				__typename: "TaskForce" as const,
				id: event.id,
				position: event.position,
				movementVector: event.movementVector,
				isVisible: true,
				lastUpdate: null,
			},
		})),
		// and initially feed all visible tfs as "appearing"
		startWith(
			...initialTaskForces.map((tf) => ({
				__typename: "PositionableApppearsEvent" as const,
				subject: {
					__typename: "TaskForce" as const,
					id: tf.id,
					position: tf.position,
					movementVector: tf.movementVector,
					isVisible: true,
					lastUpdate: null,
				},
			})),
		),
		mergeMap((appeared) => {
			// track the first terminal event for this task force to distinguish
			// hidden disappearances from destruction removals
			const terminalEvent$ = merge(
				fromGameEvents(gameId).pipe(
					filter((event) => event.type === "taskForce:disappeared"),
					filter((event) => event.id === appeared.subject.id),
					filter((event) => event.userId === userId),
					map(() => ({ removed: false })),
				),
				fromGameEvents(gameId).pipe(
					filter((event) => event.type === "taskForce:destroyed"),
					filter((event) => event.id === appeared.subject.id),
					map(() => ({ removed: true })),
				),
			).pipe(take(1), shareReplay(1));

			return concat(
				// double emit because pairwise does not emit on first event
				from([appeared, appeared]),
				fromGameEvents(gameId).pipe(
					filter((event) => event.type === "taskForce:position"),
					filter((event) => event.id === appeared.subject.id),
					map((event) => ({
						__typename: "PositionableMovesEvent" as const,
						subject: {
							__typename: "TaskForce" as const,
							id: event.id,
							position: event.position,
							movementVector: event.movementVector,
						},
					})),
					takeUntil(terminalEvent$),
				),
				terminalEvent$.pipe(
					map((terminalEvent) => ({
						__typename: "PositionableDisappearsEvent" as const,
						subject: {
							__typename: "TaskForce" as const,
							id: appeared.subject.id,
							isVisible: false,
							lastUpdate: new Date().toISOString(),
							// position will be updated in mapping below
							position: appeared.subject.position,
						},
						removed: terminalEvent.removed,
					})),
				),
			).pipe(
				// keep track of current and previous event to update position on disappear
				pairwise(),
				map(([prev, next]) =>
					next.__typename === "PositionableDisappearsEvent"
						? {
								...next,
								subject: { ...next.subject, position: prev.subject.position },
							}
						: next,
				),
			);
		}),
	);
}
