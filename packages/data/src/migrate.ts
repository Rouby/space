import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { getConnection, getDrizzle } from "./index.ts";

const connection = await getConnection();

const db = getDrizzle(connection);

const migrationsFolder = resolve(import.meta.filename, "../../drizzle");

try {
	await access(migrationsFolder);
	await migrate(db, { migrationsFolder });
} catch (error) {
	if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
		throw error;
	}

	console.warn(
		`No SQL migrations directory found at ${migrationsFolder}, skipping drizzle migrations.`,
	);
}

await connection.end();
