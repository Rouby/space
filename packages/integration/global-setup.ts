import { getConnection, getDrizzle } from "@space/data";

export default async function globalSetup() {
	process.env.DB_CONNECTION_STRING =
		"postgres://postgres:password@localhost:5432/testing";

	const drizzle = getDrizzle(await getConnection());

	console.log("DB setup");
}
