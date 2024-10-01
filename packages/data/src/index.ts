import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

export async function getConnection() {
	const client = new pg.Client({
		connectionString:
			process.env.DB_CONNECTION_STRING ??
			"postgres://postgres:password@localhost:5432/postgres",
	});

	await client.connect();

	return client;
}

export function getDrizzle(client: pg.Client) {
	return drizzle(client, { schema });
}
