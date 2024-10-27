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
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	name: varchar({ length: 256 }).notNull(),
	kind: resourceKind().notNull(),
	description: text().notNull(),
	discoveryWeight: integer().notNull(),
});
