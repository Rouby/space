import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

export const lastKnownStates = pgTable("lastKnownStates", {
	userId: uuid("userId")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	gameId: uuid("gameId")
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	subjectId: uuid("subjectId").notNull(),
	state: jsonb("state").notNull().$type<LastKnownState>(),
	lastUpdate: timestamp("lastUpdate").notNull(),
});

export type LastKnownState = LastKnownStarSystemState;

export type LastKnownStarSystemState = {
	ownerId: string | null;
};

export type LastKnownTaskForceState = {
	ownerId: string | null;
	position: { x: number; y: number } | null;
	movementVector: { x: number; y: number } | null;
};
