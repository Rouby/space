import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const passwords = pgTable("passwords", {
	userId: uuid("userId")
		.primaryKey()
		.references(() => users.id),
	hash: varchar("hash").notNull(),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
	user: one(users, { fields: [passwords.userId], references: [users.id] }),
}));
