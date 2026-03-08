import { randomUUID } from "node:crypto";
import { and, eq, taskForces } from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import type { Context } from "../../../../context.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const orderTaskForce: NonNullable<
	MutationResolvers["orderTaskForce"]
> = async (_parent, { id, orders, queue }, ctx) => {
	const context: Context = ctx;
	context.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: and(eq(taskForces.id, id), eq(taskForces.ownerId, context.userId)),
	});

	if (!taskForce) {
		context.denyAccess({
			message: "Task force not found",
			code: "NOT_AUTHORIZED",
			reason: "order-task-force-not-owner",
			details: { taskForceId: id },
		});
	}

	const newOrders: NonNullable<typeof taskForces.$inferInsert.orders> = orders
		.map((order) => {
			if (order.move) {
				return {
					id: randomUUID(),
					type: "move" as const,
					destination: order.move.destination,
				};
			}
			if (order.follow) {
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
		throw createGraphQLError("Invalid orders");
	}

	const [updated] = await ctx.drizzle
		.update(taskForces)
		.set({
			orders: [...(queue && taskForce ? taskForce.orders : []), ...newOrders],
		})
		.where(and(eq(taskForces.id, id), eq(taskForces.ownerId, context.userId)))
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
