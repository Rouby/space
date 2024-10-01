import { migrate } from "drizzle-orm/postgres-js/migrator";
import { getConnection, getDrizzle } from ".";

const connection = await getConnection();

const db = getDrizzle(connection);

await migrate(db, { migrationsFolder: "./drizzle" });

await connection.end();
