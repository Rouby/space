import { getConnection, getDrizzle } from "@space/data";
import { games, users } from "@space/data/schema";

export default async function globalTeardown() {
	process.env.DB_CONNECTION_STRING =
		"postgres://postgres:password@localhost:5432/testing";

	const drizzle = getDrizzle(await getConnection());

	await drizzle.delete(users);
	await drizzle.delete(games);
}
