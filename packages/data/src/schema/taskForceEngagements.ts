import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	json,
	pgTable,
	point,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { taskForces } from "./taskForces.ts";
import { users } from "./users.ts";

export const taskForceEngagements = pgTable(
	"taskForceEngagements",
	{
		id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
		gameId: uuid()
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		taskForceIdA: uuid()
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
		taskForceIdB: uuid()
			.notNull()
			.references(() => taskForces.id, { onDelete: "cascade" }),
		ownerIdA: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		ownerIdB: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		position: point({ mode: "xy" }).notNull(),
		phase: varchar({ length: 64 }).notNull().default("awaiting_submissions"),
		currentRound: integer().notNull().default(1),
		stateA: json().$type<{
			taskForceId: string;
			hp: number;
			maxHp: number;
			shieldHp: number;
			shieldMaxHp: number;
			armorRating: number;
			weaponRating: number;
			thrusterRating: number;
			sensorRating: number;
			hand: string[];
			deck: string[];
			discard: string[];
			nextDamageBonus: number;
			nextDamageReduction: number;
		} | null>(),
		stateB: json().$type<{
			taskForceId: string;
			hp: number;
			maxHp: number;
			shieldHp: number;
			shieldMaxHp: number;
			armorRating: number;
			weaponRating: number;
			thrusterRating: number;
			sensorRating: number;
			hand: string[];
			deck: string[];
			discard: string[];
			nextDamageBonus: number;
			nextDamageReduction: number;
		} | null>(),
		submittedCardIdA: varchar({ length: 64 }),
		submittedCardIdB: varchar({ length: 64 }),
		roundLog: json()
			.notNull()
			.$type<
				{
					round: number;
					attackerTaskForceId: string;
					targetTaskForceId: string;
					cardId: string;
					effectType: "damage" | "buff" | "special";
					resolvedValue: number;
					shieldDamage: number;
					armorAbsorbed: number;
					hullDamage: number;
					attackerHpAfter: number;
					targetHpAfter: number;
				}[]
			>()
			.default([]),
		winnerTaskForceId: uuid().references(() => taskForces.id, {
			onDelete: "set null",
		}),
		startedAtTurn: integer().notNull(),
		resolvedAtTurn: integer(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		index().on(table.gameId, table.resolvedAtTurn),
		index().on(table.gameId, table.ownerIdA, table.resolvedAtTurn),
		index().on(table.gameId, table.ownerIdB, table.resolvedAtTurn),
	],
);

export const taskForceEngagementsRelations = relations(
	taskForceEngagements,
	({ one }) => ({
		game: one(games, {
			fields: [taskForceEngagements.gameId],
			references: [games.id],
		}),
		taskForceA: one(taskForces, {
			fields: [taskForceEngagements.taskForceIdA],
			references: [taskForces.id],
		}),
		taskForceB: one(taskForces, {
			fields: [taskForceEngagements.taskForceIdB],
			references: [taskForces.id],
		}),
		ownerA: one(users, {
			fields: [taskForceEngagements.ownerIdA],
			references: [users.id],
		}),
		ownerB: one(users, {
			fields: [taskForceEngagements.ownerIdB],
			references: [users.id],
		}),
	}),
);
