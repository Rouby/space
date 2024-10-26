import { sql } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";

export const resourceKind = pgEnum("resourceKind", [
	"metal",
	"crystal",
	"gas",
	"liquid",
	"biological",
]);

export const resources = pgTable("resources", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 256 }).notNull(),
	kind: resourceKind("kind").notNull(),
	description: text("description").notNull(),
	discoveryWeight: integer("discoveryWeight").notNull(),
});
