import {
	concat,
	filter,
	from,
	map,
	mergeMap,
	startWith,
	takeUntil,
} from "rxjs";
import { fromGameEvents } from "../workers.ts";

export function starSystems$({
	initialStarSystems,
	gameId,
	userId,
}: {
	initialStarSystems: {
		id: string;
		position: { x: number; y: number };
		ownerId: string | null;
		discoverySlots: number;
		discoveryProgress: string;
	}[];
	gameId: string;
	userId: string;
}) {
	return fromGameEvents(gameId).pipe(
		filter((event) => event.type === "starSystem:appeared"),
		filter((event) => event.userId === userId),
		map((event) => ({
			__typename: "PositionableApppearsEvent" as const,
			subject: {
				__typename: "StarSystem" as const,
				id: event.id,
				position: event.position,
				isVisible: true,
				lastUpdate: null,
			},
		})),
		// and initially feed all visible sss as "appearing"
		startWith(
			...initialStarSystems.map((ss) => ({
				__typename: "PositionableApppearsEvent" as const,
				subject: {
					__typename: "StarSystem" as const,
					...ss,
					isVisible: true,
					lastUpdate: null,
				},
			})),
		),
		mergeMap((appeared) =>
			// for each appear event, emit appear and wait until disappear
			concat(
				from([appeared]),
				// add owner-change-events
				fromGameEvents(gameId).pipe(
					filter((event) => event.type === "starSystem:ownerChanged"),
					filter((event) => event.id === appeared.subject.id),
					map((event) => ({
						__typename: "StarSystemUpdateEvent" as const,
						subject: {
							...appeared.subject,
							id: appeared.subject.id,
							ownerId: event.ownerId,
							gameId,
						},
					})),
					// until the star system disappears
					takeUntil(
						fromGameEvents(gameId).pipe(
							filter((event) => event.type === "starSystem:disappeared"),
							filter((event) => event.id === appeared.subject.id),
							filter((event) => event.userId === userId),
						),
					),
				),
				from([
					{
						__typename: "PositionableDisappearsEvent" as const,
						subject: {
							...appeared.subject,
							isVisible: false,
							lastUpdate: new Date().toISOString(),
						},
					},
				]),
			),
		),
	);
}
