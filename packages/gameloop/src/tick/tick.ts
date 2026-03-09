import { parentPort } from "node:worker_threads";
import {
	and,
	eq,
	games,
	isNotNull,
	lastKnownStates,
	players,
	sql,
	starSystems,
	taskForces,
	turnReports,
	visibility,
} from "@space/data/schema";
import type { GameEvent } from "../../../backend/src/events.ts";
import { gameId } from "../config.ts";
import { drizzle } from "../db.ts";
import { tickColonization } from "./colonization.ts";
import { tickDiscoveries } from "./discoveries.ts";
import { tickStarSystemEconomy } from "./starSystemEconomy.ts";
import { tickStarSystemPopulation } from "./starSystemPopulation.ts";
import { tickTaskForceCombat } from "./taskForceCombat.ts";
import { tickTaskForceConstruction } from "./taskForceConstruction.ts";
import { tickTaskForceMovement } from "./taskForceMovement.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<(typeof drizzle)["transaction"]>
>;
export type Context = {
	postMessage: (event: GameEvent) => void;
	turn: number;
};

export async function tick() {
	const messages: GameEvent[] = [];
	const ctx: Context = {
		postMessage: (event) => messages.push(event),
		turn: (
			await drizzle
				.select({ turnNumber: games.turnNumber })
				.from(games)
				.where(eq(games.id, gameId))
		)[0].turnNumber,
	};

	await drizzle.transaction(async (tx) => {
		const visibilityPreTick = sql.raw(`"pre_tick_visibility_${gameId}"`);

		await storePreTickVisibility();

		await tickDiscoveries(tx, ctx);

		await tickColonization(tx, ctx);

		const industryChanges = await tickTaskForceConstruction(tx, ctx);

		await tickTaskForceMovement(tx, ctx);

		await tickTaskForceCombat(tx, ctx);

		const populationChanges = await tickStarSystemPopulation(tx, ctx);

		const miningChanges = await tickStarSystemEconomy(tx, ctx);

		await tx.insert(turnReports).values({
			gameId,
			turnNumber: ctx.turn,
			summary: {
				populationChanges: populationChanges.map((change) => ({
					starSystemId: change.starSystemId,
					populationId: change.populationId,
					previousAmount: change.previousAmount.toString(),
					newAmount: change.newAmount.toString(),
					growth: change.growth.toString(),
				})),
				miningChanges,
				industryChanges,
			},
		});

		await notifyAboutVisibilityChanges();

		await tx
			.update(players)
			.set({ turnEndedAt: null })
			.where(eq(players.gameId, gameId));

		await tx
			.update(games)
			.set({ turnNumber: ctx.turn + 1 })
			.where(eq(games.id, gameId));

		ctx.postMessage({
			type: "game:turnEnded",
			gameId,
			turnNumber: ctx.turn,
		});

		ctx.postMessage({
			type: "game:newTurnCalculated",
			gameId,
			turnNumber: ctx.turn + 1,
		});

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
						eq(
							sql`${visibility}.${sql.identifier(visibility.userId.fieldAlias)}`,
							players.userId,
						),
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
								eq(
									sql`${visibility}.${sql.identifier(visibility.userId.fieldAlias)}`,
									players.userId,
								),
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
						movementVector: taskForces.movementVector,
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
							eq(
								sql`${visibility}.${sql.identifier(visibility.userId.fieldAlias)}`,
								players.userId,
							),
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
							movementVector: { x: number; y: number } | null;
							visible: boolean;
							previouslyVisible: boolean;
						}[]
					>`json_agg(json_build_object('id', ${TaskForceVisibility.taskForceId}, 'position', json_build_object('x', ${TaskForceVisibility.position}[0], 'y', ${TaskForceVisibility.position}[1]), 'movementVector', CASE WHEN ${TaskForceVisibility.movementVector} IS NOT NULL THEN json_build_object('x', ${TaskForceVisibility.movementVector}[0], 'y', ${TaskForceVisibility.movementVector}[1]) ELSE NULL END, 'visible', CASE WHEN ${TaskForceVisibility.visible} IS NOT NULL THEN true ELSE false END, 'previouslyVisible', CASE WHEN ${TaskForceVisibility.pre_visible} IS NOT NULL THEN true ELSE false END))`,
				})
				.from(TaskForceVisibility)
				.groupBy(sql`"userId"`);

			for (const { userId, taskForces } of taskForcesChanges) {
				if (userId) {
					for (const {
						id,
						position,
						movementVector,
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
									movementVector,
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
											movementVector,
										},
									})
									.onConflictDoUpdate({
										set: {
											lastUpdate: new Date(),
											state: {
												ownerId: null,
												position,
												movementVector,
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
							eq(
								sql`${visibility}.${sql.identifier(visibility.userId.fieldAlias)}`,
								players.userId,
							),
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
