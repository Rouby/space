import {
	createInlineSigningKeyProvider,
	extractFromCookie,
	useJWT,
} from "@graphql-yoga/plugin-jwt";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { resolvers } from "./schema/resolvers.generated";
import { typeDefs } from "./schema/typeDefs.generated";

const signingKey = process.env.JWT_SECRET || "electric-kitten";
const port = process.env.PORT || 3000;

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
	],
});

const server = createServer(yoga);

server.listen(port, () => {
	console.log(
		`Server is running on http://localhost:${port}${yoga.graphqlEndpoint}`,
	);
});

for (const signal of ["SIGHUP", "SIGINT", "SIGTERM"]) {
	process.on(signal, () => {
		console.log("Restarting...");
		server.close(() => {
			process.exit(0);
		});
	});
}
