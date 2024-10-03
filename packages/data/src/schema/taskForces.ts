import { sql } from "drizzle-orm";
import { pgTable, point, uuid, varchar } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

export const taskForces = pgTable("taskForces", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	userId: uuid("userId")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar("name", { length: 256 }).notNull(),
	position: point("position", { mode: "xy" }).notNull(),
});
