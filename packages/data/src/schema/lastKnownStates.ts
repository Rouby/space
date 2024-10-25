import {
	type AnyColumn,
	type GetColumnData,
	and,
	eq,
	exists,
	sql,
} from "drizzle-orm";
import {
	jsonb,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import type { getDrizzle } from "../index.ts";
import { games } from "./games.ts";
import { users } from "./users.ts";
import { visibility } from "./visibility.ts";

export const lastKnownStates = pgTable(
	"lastKnownStates",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		gameId: uuid("gameId")
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		subjectId: uuid("subjectId").notNull(),
		state: jsonb("state").notNull().$type<LastKnownState>(),
		lastUpdate: timestamp("lastUpdate").notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.gameId, table.subjectId],
		}),
	}),
);

export type LastKnownState = LastKnownStarSystemState | LastKnownTaskForceState;

export type LastKnownStarSystemState = {
	ownerId: string | null;
};

export type LastKnownTaskForceState = {
	ownerId: string | null;
	position: { x: number; y: number } | null;
	movementVector: { x: number; y: number } | null;
};

export function possiblyHidden<T extends AnyColumn>(column: T) {
	return sql<GetColumnData<T> | null>`CASE WHEN ${visibility.circle} IS NOT NULL THEN to_jsonb(${column}) ELSE CASE WHEN ${lastKnownStates.state} IS NOT NULL THEN ${lastKnownStates.state}->'${sql.raw(column.name)}' ELSE NULL END END`;
}

export function getLastKnownHelper({
	tx,
	gameId,
	userId,
	position,
}: {
	tx: ReturnType<typeof getDrizzle>;
	gameId: string;
	userId: string;
	position: AnyColumn;
}) {
	const TaskForceVisibility = tx.$with("TaskForceVisibility").as((qb) =>
		qb
			.select()
			.from(visibility)
			.where(and(eq(visibility.gameId, gameId), eq(visibility.userId, userId))),
	);

	const visibilityExists = exists(
		tx
			.select({ circle: TaskForceVisibility.circle })
			.from(TaskForceVisibility)
			.where(sql`${TaskForceVisibility.circle} @> ${position}`),
	);

	function possiblyHidden<T extends AnyColumn>(column: T) {
		return sql<GetColumnData<T> | null>`CASE WHEN ${visibilityExists} THEN to_jsonb(${column}) ELSE CASE WHEN ${lastKnownStates.state} IS NOT NULL THEN ${lastKnownStates.state}->'${sql.raw(column.name)}' ELSE NULL END END`.mapWith(
			column,
		);
	}

	function knownOrLastKnown<T extends AnyColumn>(column: T) {
		return sql<
			GetColumnData<T>
		>`CASE WHEN ${visibilityExists} THEN to_jsonb(${column}) ELSE ${lastKnownStates.state}->'${sql.raw(column.name)}' END`.mapWith(
			column,
		);
	}

	return {
		TaskForceVisibility,
		visibilityExists,
		possiblyHidden,
		knownOrLastKnown,
	};
}
