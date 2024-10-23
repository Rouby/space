import type { getDrizzle } from "../index.ts";
import { eq, games } from "../schema.ts";
import { migrateFrom0To1 } from "./0001.ts";
import { migrateFrom1To2 } from "./0002.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export type Transaction = FirstArgument<
	FirstArgument<ReturnType<typeof getDrizzle>["transaction"]>
>;

const migrations = [migrateFrom0To1, migrateFrom1To2];

export async function applyMigrations(tx: Transaction, gameId: string) {
	const [game] = await tx
		.select({ version: games.version })
		.from(games)
		.where(eq(games.id, gameId));

	for (const migration of migrations.slice(game.version)) {
		await migration(tx, gameId);
		console.log(`Applied migration v${game.version} -> v${++game.version}`);
	}

	await tx
		.update(games)
		.set({ version: migrations.length })
		.where(eq(games.id, gameId));
}
