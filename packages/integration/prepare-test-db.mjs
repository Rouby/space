import { Client } from "pg";

const fallbackConnectionString =
	"postgres://postgres:password@localhost:5432/testing";

const targetConnectionString =
	process.env.DB_CONNECTION_STRING ?? fallbackConnectionString;
const targetUrl = new URL(targetConnectionString);
const targetDatabase = targetUrl.pathname.replace(/^\//, "") || "testing";

if (!/^[a-zA-Z0-9_]+$/.test(targetDatabase)) {
	throw new Error(`Unsupported test database name: ${targetDatabase}`);
}

const adminUrl = new URL(targetConnectionString);
adminUrl.pathname = "/postgres";

const adminClient = new Client({ connectionString: adminUrl.toString() });
await adminClient.connect();

try {
	await adminClient.query(
		`select pg_terminate_backend(pid)
		 from pg_stat_activity
		 where datname = $1 and pid <> pg_backend_pid()`,
		[targetDatabase],
	);

	await adminClient.query(`drop database if exists ${targetDatabase}`);
	await adminClient.query(`create database ${targetDatabase}`);

	console.log(`Recreated fresh test database: ${targetDatabase}`);
} finally {
	await adminClient.end();
}
