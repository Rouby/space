import { sql } from "drizzle-orm";
import { json, pgTable, point, uuid, varchar } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

export const taskForces = pgTable("taskForces", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid("ownerId")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar("name", { length: 256 }).notNull(),
	position: point("position", { mode: "xy" }).notNull(),
	orders: json("orders")
		.notNull()
		.$type<
			{ id: string; type: "move"; destination: { x: number; y: number } }[]
		>()
		.default([]),
});
