import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import { getConnection, getDrizzle } from "./index.ts";

const connection = await getConnection();

const db = getDrizzle(connection);

await migrate(db, {
	migrationsFolder: resolve(import.meta.filename, "../../drizzle"),
});

await connection.end();
