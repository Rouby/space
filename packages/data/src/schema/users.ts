import { relations, sql } from "drizzle-orm";
import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { passwords } from "./passwords";

export const users = pgTable(
	"users",
	{
		id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
		email: varchar("email", { length: 256 }).notNull(),
		name: varchar("name", { length: 256 }).notNull(),
	},
	(users) => {
		return {
			emailIndex: uniqueIndex("email_idx").on(users.email),
			nameIndex: uniqueIndex("name_idx").on(users.name),
		};
	},
);

export const usersRelations = relations(users, ({ one }) => ({
	password: one(passwords),
}));
