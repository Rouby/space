import {
	and,
	eq,
	players,
	sql,
	taskForces,
	visibility,
} from "@space/data/schema";
import { parentPort } from "node:worker_threads";
import type { GameEvent } from "../../../backend/src/events.ts";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { tickTaskForceCommisions } from "./taskForceCommisions.ts";
import { tickTaskForceEngagements } from "./taskForceEngagements.ts";
import { tickTaskForceMovements } from "./taskForceMovements.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = {
	postMessage: (event: GameEvent) => void;
};

export async function tick() {
	const messages: GameEvent[] = [];
	const ctx: Context = {
		postMessage: (event) => messages.push(event),
	};

	await drizzle.transaction(async (tx) => {
		const visibilityPreTick = sql.raw(`"pre_tick_visibility_${gameId}"`);

		await storePreTickVisibility();

		await tickTaskForceCommisions(tx, ctx);

		await tickTaskForceMovements(tx, ctx);

		await tickTaskForceEngagements(tx, ctx);

		await notifyAboutVisibilityChanges();

		/// ------------------------------------------------------------

		async function storePreTickVisibility() {
			await tx.execute(
				sql`CREATE TEMPORARY TABLE ${visibilityPreTick} (
					"userId" uuid NOT NULL,
					"taskForceId" uuid NOT NULL,
					"position" "point" NOT NULL,
					"visible" "circle"
				) ON COMMIT DROP`,
			);

			const query = tx
				.select({
					userId: players.userId,
					taskForceId: taskForces.id,
					position: taskForces.position,
					visible: visibility.circle,
				})
				.from(players)
				.fullJoin(taskForces, eq(players.gameId, taskForces.gameId))
				.where(eq(players.gameId, sql.raw(`'${gameId}'`)))
				.leftJoin(
					visibility,
					and(
						eq(visibility.gameId, players.gameId),
						eq(visibility.userId, players.userId),
						sql`${visibility.circle} @> ${taskForces.position}`,
					),
				)
				.toSQL();

			await tx.execute(
				sql`INSERT INTO ${visibilityPreTick} ${sql.raw(query.sql)}`,
			);
		}

		async function notifyAboutVisibilityChanges() {
			const Visibility = tx.$with("Visibility").as((qb) =>
				qb
					.select({
						userId: players.userId,
						taskForceId: taskForces.id,
						position: taskForces.position,
						visible: visibility.circle,
						pre_visible: sql`${visibilityPreTick}."visible"`.as("pre_visible"),
					})
					.from(players)
					.fullJoin(taskForces, eq(players.gameId, taskForces.gameId))
					.where(eq(players.gameId, gameId))
					.leftJoin(
						visibility,
						and(
							eq(visibility.gameId, players.gameId),
							eq(visibility.userId, players.userId),
							sql`${visibility.circle} @> ${taskForces.position}`,
						),
					)
					.leftJoin(
						visibilityPreTick,
						and(
							eq(sql`${visibilityPreTick}."userId"`, players.userId),
							eq(sql`${visibilityPreTick}."taskForceId"`, taskForces.id),
						),
					),
			);

			const visibilityChanges = await tx
				.with(Visibility)
				.select({
					userId: Visibility.userId,
					taskForces: sql<
						{
							id: string;
							position: { x: number; y: number };
							visible: boolean;
							previouslyVisible: boolean;
						}[]
					>`json_agg(json_build_object('id', ${Visibility.taskForceId}, 'position', json_build_object('x', ${Visibility.position}[0], 'y', ${Visibility.position}[1]), 'visible', CASE WHEN ${Visibility.visible} IS NOT NULL THEN true ELSE false END, 'previouslyVisible', CASE WHEN ${Visibility.pre_visible} IS NOT NULL THEN true ELSE false END))`,
				})
				.from(Visibility)
				.groupBy(sql`"userId"`);

			for (const { userId, taskForces } of visibilityChanges) {
				if (userId) {
					for (const {
						id,
						position,
						visible,
						previouslyVisible,
					} of taskForces) {
						if (visible !== previouslyVisible) {
							if (visible) {
								ctx.postMessage({
									type: "taskForce:appeared",
									id,
									position,
									userId,
									movementVector: null,
								});
							} else {
								ctx.postMessage({
									type: "taskForce:disappeared",
									id,
									position,
									userId,
								});
							}
						}
					}
				}
			}
		}
	});

	for (const message of messages) {
		parentPort?.postMessage(message);
	}
}
