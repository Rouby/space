import {
	createInlineSigningKeyProvider,
	extractFromCookie,
	useJWT,
} from "@graphql-yoga/plugin-jwt";
import { getConnection, getDrizzle } from "@space/data";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createSchema, createYoga, useExtendContext } from "graphql-yoga";
import { createServer } from "node:http";
import { resolvers } from "./schema/resolvers.generated.ts";
import { typeDefs } from "./schema/typeDefs.generated.ts";

const signingKey = process.env.JWT_SECRET || "electric-kitten";
const port = process.env.PORT || 3000;

const pgConnection = await getConnection();

const yoga = createYoga({
	schema: createSchema({ typeDefs, resolvers }),
	plugins: [
		useCookies(),

		useJWT({
			singingKeyProviders: [createInlineSigningKeyProvider(signingKey)],
			tokenLookupLocations: [
				extractFromCookie({ name: "token" }),
				// extractFromHeader({ name: "authorization", prefix: "Bearer" }),
			],
			tokenVerification: {
				issuer: "urn:sapce:issuer",
				audience: "urn:space:audience",
				algorithms: ["HS256", "RS256"],
			},
			extendContext: true,
			reject: {
				missingToken: false,
				invalidToken: true,
			},
		}),

		useExtendContext(async () => {
			return {
				drizzle: getDrizzle(pgConnection),
			};
		}),
	],
});

const server = createServer(yoga);

server.listen(port, () => {
	console.log(
		`Server is running on http://localhost:${port}${yoga.graphqlEndpoint}`,
	);
});

for (const signal of ["SIGHUP", "SIGINT", "SIGTERM"]) {
	process.on(signal, async () => {
		console.log("Stopping...");

		await Promise.all([
			new Promise((res) => server.close(res)),
			pgConnection.end(),
		]);

		process.exit(0);
	});
}
