import { relations, sql } from "drizzle-orm";
import {
	index,
	pgTable,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		email: varchar({ length: 256 }).notNull(),
		name: varchar({ length: 256 }).notNull(),
	},
	(table) => [
		{
			email: uniqueIndex().on(table.email),
			name: index().on(table.name),
		},
	],
);

export const passwords = pgTable("passwords", {
	userId: uuid()
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	hash: varchar().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
	password: one(passwords),
}));

export const passwordsRelations = relations(passwords, ({ one }) => ({
	user: one(users, { fields: [passwords.userId], references: [users.id] }),
}));
