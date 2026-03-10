import { randomUUID } from "node:crypto";
import { and, eq, isNull, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const orderTaskForce: NonNullable<
	MutationResolvers["orderTaskForce"]
> = async (_parent, { id, orders, queue }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.id, id),
			eq(taskForces.ownerId, context.userId),
			isNull(taskForces.deletedAt),
		),
	});

	if (!taskForce) {
		return context.denyAccess({
			message: "Task force not found",
			code: "NOT_AUTHORIZED",
			reason: "order-task-force-not-owner",
			details: { taskForceId: id },
		});
	}

	const isFiniteNumber = (value: number) => Number.isFinite(value);

	const validateMove = (destination: { x: number; y: number }) => {
		if (!isFiniteNumber(destination.x) || !isFiniteNumber(destination.y)) {
			throw createGraphQLError("Move destination must be finite coordinates", {
				extensions: { code: "INVALID_TASK_FORCE_ORDER" },
			});
		}
	};

	const queuedOrders = queue ? taskForce.orders : [];

	const newOrders: NonNullable<typeof taskForces.$inferInsert.orders> = orders
		.map((order) => {
			if (order.move) {
				validateMove(order.move.destination);
				return {
					id: randomUUID(),
					type: "move" as const,
					destination: order.move.destination,
				};
			}
			if (order.follow) {
				if (order.follow.taskForceId === id) {
					throw createGraphQLError("Task force cannot follow itself", {
						extensions: { code: "INVALID_TASK_FORCE_ORDER" },
					});
				}
				return {
					id: randomUUID(),
					type: "follow" as const,
					taskForceId: order.follow.taskForceId,
				};
			}
			if (order.colonize) {
				return {
					id: randomUUID(),
					type: "colonize" as const,
				};
			}
			return false;
		})
		.filter((d) => !!d);

	if (newOrders.length === 0) {
		throw createGraphQLError("Invalid orders", {
			extensions: { code: "INVALID_TASK_FORCE_ORDER" },
		});
	}

	const [updated] = await ctx.drizzle
		.update(taskForces)
		.set({
			orders: [...queuedOrders, ...newOrders],
		})
		.where(
			and(
				eq(taskForces.id, id),
				eq(taskForces.ownerId, context.userId),
				isNull(taskForces.deletedAt),
			),
		)
		.returning();

	if (!updated) {
		context.denyAccess({
			message: "Task force not found",
			code: "NOT_AUTHORIZED",
			reason: "order-task-force-update-denied",
			details: { taskForceId: id },
		});
	}

	return { ...updated, isVisible: true, lastUpdate: null };
};
