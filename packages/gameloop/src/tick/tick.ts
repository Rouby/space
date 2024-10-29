import {
	and,
	eq,
	isNotNull,
	lastKnownStates,
	players,
	sql,
	starSystems,
	taskForces,
	visibility,
} from "@space/data/schema";
import { parentPort } from "node:worker_threads";
import type { GameEvent } from "../../../backend/src/events.ts";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { tickDiscoveries } from "./discoveries.ts";
import { tickStarSystemEconomy } from "./starSystemEconomy.ts";
import { tickStarSystemPopulation } from "./starSystemPopulation.ts";
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

		await tickDiscoveries(tx, ctx);

		await tickStarSystemPopulation(tx, ctx);

		await tickStarSystemEconomy(tx, ctx);

		await tickTaskForceCommisions(tx, ctx);

		await tickTaskForceMovements(tx, ctx);

		await tickTaskForceEngagements(tx, ctx);

		await notifyAboutVisibilityChanges();

		/// ------------------------------------------------------------

		async function storePreTickVisibility() {
			const query = tx
				.select({
					userId: players.userId,
					subjectId: taskForces.id,
					position: taskForces.position,
					visible: visibility.circle,
				})
				.from(players)
				.fullJoin(taskForces, eq(players.gameId, taskForces.gameId))
				.where(
					and(
						eq(players.gameId, sql.raw(`'${gameId}'`)),
						isNotNull(taskForces.id),
					),
				)
				.leftJoin(
					visibility,
					and(
						eq(visibility.gameId, players.gameId),
						eq(visibility.userId, players.userId),
						sql`${visibility.circle} @> ${taskForces.position}`,
					),
				)
				.unionAll(
					tx
						.select({
							userId: players.userId,
							subjectId: starSystems.id,
							position: starSystems.position,
							visible: visibility.circle,
						})
						.from(players)
						.fullJoin(starSystems, eq(players.gameId, starSystems.gameId))
						.where(
							and(
								eq(players.gameId, sql.raw(`'${gameId}'`)),
								isNotNull(starSystems.id),
							),
						)
						.leftJoin(
							visibility,
							and(
								eq(visibility.gameId, players.gameId),
								eq(visibility.userId, players.userId),
								sql`${visibility.circle} @> ${starSystems.position}`,
							),
						),
				)
				.toSQL();

			await tx.execute(
				sql`CREATE TEMPORARY TABLE ${visibilityPreTick} (
					"userId" uuid NOT NULL,
					"subjectId" uuid NOT NULL,
					"position" "point" NOT NULL,
					"visible" "circle"
				) ON COMMIT DROP`,
			);
			await tx.execute(
				sql`INSERT INTO ${visibilityPreTick} ${sql.raw(query.sql)}`,
			);
		}

		async function notifyAboutVisibilityChanges() {
			const TaskForceVisibility = tx.$with("TaskForceVisibility").as((qb) =>
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
							eq(sql`${visibilityPreTick}."subjectId"`, taskForces.id),
						),
					),
			);

			const taskForcesChanges = await tx
				.with(TaskForceVisibility)
				.select({
					userId: TaskForceVisibility.userId,
					taskForces: sql<
						{
							id: string;
							position: { x: number; y: number };
							visible: boolean;
							previouslyVisible: boolean;
						}[]
					>`json_agg(json_build_object('id', ${TaskForceVisibility.taskForceId}, 'position', json_build_object('x', ${TaskForceVisibility.position}[0], 'y', ${TaskForceVisibility.position}[1]), 'visible', CASE WHEN ${TaskForceVisibility.visible} IS NOT NULL THEN true ELSE false END, 'previouslyVisible', CASE WHEN ${TaskForceVisibility.pre_visible} IS NOT NULL THEN true ELSE false END))`,
				})
				.from(TaskForceVisibility)
				.groupBy(sql`"userId"`);

			for (const { userId, taskForces } of taskForcesChanges) {
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
									userId,
								});

								await tx
									.insert(lastKnownStates)
									.values({
										userId,
										gameId,
										subjectId: id,
										lastUpdate: new Date(),
										state: {
											ownerId: null,
											position,
											// TODO: add movement vector
											movementVector: null,
										},
									})
									.onConflictDoUpdate({
										set: {
											lastUpdate: new Date(),
											state: {
												ownerId: null,
												position,
												// TODO: add movement vector
												movementVector: null,
											},
										},
										target: [
											lastKnownStates.userId,
											lastKnownStates.gameId,
											lastKnownStates.subjectId,
										],
									});
							}
						}
					}
				}
			}

			const StarSystemVisibility = tx.$with("StarSystemVisibility").as((qb) =>
				qb
					.select({
						userId: players.userId,
						starSystemId: starSystems.id,
						position: starSystems.position,
						visible: visibility.circle,
						pre_visible: sql`${visibilityPreTick}."visible"`.as("pre_visible"),
					})
					.from(players)
					.fullJoin(starSystems, eq(players.gameId, starSystems.gameId))
					.where(eq(players.gameId, gameId))
					.leftJoin(
						visibility,
						and(
							eq(visibility.gameId, players.gameId),
							eq(visibility.userId, players.userId),
							sql`${visibility.circle} @> ${starSystems.position}`,
						),
					)
					.leftJoin(
						visibilityPreTick,
						and(
							eq(sql`${visibilityPreTick}."userId"`, players.userId),
							eq(sql`${visibilityPreTick}."subjectId"`, starSystems.id),
						),
					),
			);

			const starSystemsChanges = await tx
				.with(StarSystemVisibility)
				.select({
					userId: StarSystemVisibility.userId,
					starSystems: sql<
						{
							id: string;
							position: { x: number; y: number };
							visible: boolean;
							previouslyVisible: boolean;
						}[]
					>`json_agg(json_build_object('id', ${StarSystemVisibility.starSystemId}, 'position', json_build_object('x', ${StarSystemVisibility.position}[0], 'y', ${StarSystemVisibility.position}[1]), 'visible', CASE WHEN ${StarSystemVisibility.visible} IS NOT NULL THEN true ELSE false END, 'previouslyVisible', CASE WHEN ${StarSystemVisibility.pre_visible} IS NOT NULL THEN true ELSE false END))`,
				})
				.from(StarSystemVisibility)
				.groupBy(sql`"userId"`);

			for (const { userId, starSystems } of starSystemsChanges) {
				if (userId) {
					for (const {
						id,
						position,
						visible,
						previouslyVisible,
					} of starSystems) {
						if (visible !== previouslyVisible) {
							if (visible) {
								ctx.postMessage({
									type: "starSystem:appeared",
									id,
									position,
									userId,
								});
							} else {
								ctx.postMessage({
									type: "starSystem:disappeared",
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
