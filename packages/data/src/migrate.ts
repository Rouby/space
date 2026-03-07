import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import { getConnection, getDrizzle } from "./index.ts";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

async function connectWithRetry() {
	let lastError: Error | undefined;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await getConnection();
		} catch (err) {
			lastError = err as Error;
			console.error(
				`[migrate] Attempt ${attempt}/${MAX_RETRIES} failed to connect to database:`,
				lastError.message,
			);
			if (attempt < MAX_RETRIES) {
				console.log(`[migrate] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
				await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
			}
		}
	}
	console.error("[migrate] Exhausted all retries. Exiting.");
	throw lastError ?? new Error("Failed to connect to database after all retries");
}

const connection = await connectWithRetry();

const db = getDrizzle(connection);

await migrate(db, {
	migrationsFolder: resolve(import.meta.filename, "../../drizzle"),
});

await connection.end();
