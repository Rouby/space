import {
	and,
	eq,
	games,
	players,
	sql,
	taskForces,
	users,
	visibility,
} from "@space/data/schema";
import { expect, it } from "vitest";
import { drizzle } from "../db.ts";

it("should do things", async () => {
	await drizzle.delete(games);
	await drizzle.delete(users);

	const [{ id: user1Id }] = await drizzle
		.insert(users)
		.values({
			id: "bbbbbbbb-df96-48f4-9365-3f54638cdad0",
			name: "Bob",
			email: "bob@example.com",
		})
		.returning();
	const [{ id: user2Id }] = await drizzle
		.insert(users)
		.values({
			id: "aaaaaaaa-df96-48f4-9365-3f54638cdad0",
			name: "Alice",
			email: "Alice@example.com",
		})
		.returning();

	const [{ id: gameId }] = await drizzle
		.insert(games)
		.values({ name: "Game" })
		.returning();

	await drizzle.insert(players).values([
		{ gameId, userId: user1Id },
		{ gameId, userId: user2Id },
	]);

	const [{ id: taskForce1Id }, { id: taskForce2Id }] = await drizzle
		.insert(taskForces)
		.values([
			{
				id: "bbbbbbbb-614d-4174-97fc-8af5e9e40ed2",
				gameId,
				ownerId: user1Id,
				name: "TF1",
				position: { x: 0, y: 0 },
			},
			{
				id: "aaaaaaaa-614d-4174-97fc-8af5e9e40ed2",
				gameId,
				ownerId: user2Id,
				name: "TF2",
				position: { x: 120, y: 0 },
			},
		])
		.returning();

	const value = await drizzle.transaction(async (tx) => {
		const visibilityPreTick = sql.raw(`"pre_tick_visibility_${gameId}"`);

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

		await tx
			.update(taskForces)
			.set({ position: { x: 40, y: 0 } })
			.where(eq(taskForces.id, taskForce2Id));

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

		return await tx
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
	});

	const user1 = value.find((row) => row.userId === user1Id);
	user1?.taskForces.sort((a, b) => a.id.localeCompare(b.id));
	const user2 = value.find((row) => row.userId === user2Id);
	user2?.taskForces.sort((a, b) => a.id.localeCompare(b.id));

	expect([user1, user2]).toMatchObject([
		{
			userId: user1Id,
			taskForces: [
				{ id: taskForce1Id, visible: true, previouslyVisible: true },
				{ id: taskForce2Id, visible: true, previouslyVisible: false },
			].sort((a, b) => a.id.localeCompare(b.id)),
		},
		{
			userId: user2Id,
			taskForces: [
				{ id: taskForce1Id, visible: true, previouslyVisible: false },
				{ id: taskForce2Id, visible: true, previouslyVisible: true },
			].sort((a, b) => a.id.localeCompare(b.id)),
		},
	]);
});
