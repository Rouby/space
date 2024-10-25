import {
	and,
	eq,
	notExists,
	taskForceEngagementsToTaskForces,
	taskForceShipCommisions,
	taskForces,
} from "@space/data/schema";
import { createGraphQLError } from "graphql-yoga";
import { randomUUID } from "node:crypto";
import type { MutationResolvers } from "./../../../types.generated.js";
export const orderTaskForce: NonNullable<
	MutationResolvers["orderTaskForce"]
> = async (_parent, { id, orders, queue }, ctx) => {
	ctx.throwWithoutClaim("urn:space:claim");

	const taskForce = await ctx.drizzle.query.taskForces.findFirst({
		where: and(
			eq(taskForces.id, id),
			// and not currently engaged in combat
			notExists(
				ctx.drizzle
					.select()
					.from(taskForceEngagementsToTaskForces)
					.where(eq(taskForceEngagementsToTaskForces.taskForceId, id)),
			),
			// and not currently building ships
			notExists(
				ctx.drizzle
					.select()
					.from(taskForceShipCommisions)
					.where(eq(taskForceShipCommisions.taskForceId, id)),
			),
		),
	});

	if (!taskForce) {
		throw createGraphQLError("Task force not found");
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
			return false;
		})
		.filter((d) => !!d);

	if (newOrders.length === 0) {
		throw createGraphQLError("Invalid orders");
	}

	const [updated] = await ctx.drizzle
		.update(taskForces)
		.set({
			orders: [...(queue ? taskForce.orders : []), ...newOrders],
		})
		.where(eq(taskForces.id, id))
		.returning();

	return { ...updated, isVisible: true, lastUpdate: null };
};
