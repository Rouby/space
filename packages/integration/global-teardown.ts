import { getConnection, getDrizzle } from "@space/data";
import { games, shipDesignComponents, users } from "@space/data/schema";

export default async function globalTeardown() {
	process.env.DB_CONNECTION_STRING =
		"postgres://postgres:password@localhost:5432/testing";

	const drizzle = getDrizzle(await getConnection());

	await drizzle.delete(shipDesignComponents);
	await drizzle.delete(games);
	await drizzle.delete(users);
}
