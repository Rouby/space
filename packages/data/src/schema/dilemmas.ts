import { sql } from "drizzle-orm";
import {
	customType,
	jsonb,
	pgTable,
	point,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { users } from "./users.ts";

const reference = customType<{
	data: { id: string; origin: "dilemmas" | "starSystems" };
}>({
	dataType(_config) {
		return "jsonb";
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
});

export const dilemmas = pgTable("dilemmas", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	title: text().notNull(),
	description: text().notNull(),
	question: text().notNull(),
	choices: jsonb().notNull().$type<
		{
			id: string;
			title: string;
			description: string;
			effects: ChoiceEffect[];
		}[]
	>(),
	choosen: varchar({ length: 256 }),
	position: point({ mode: "xy" }),
	correlation: reference(),
	causation: reference(),
});

type ChoiceEffect = GenerateDilemmaEffect;

interface GenerateDilemmaEffect {
	type: "generateDilemma";
	params: {
		promptName: string;
	};
}
