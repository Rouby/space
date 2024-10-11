import {
	type JWTExtendContextFields,
	createInlineSigningKeyProvider,
	extractFromCookie,
	useJWT,
} from "@graphql-yoga/plugin-jwt";
import { getConnection, getDrizzle } from "@space/data";
import { games, isNotNull } from "@space/data/schema";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import {
	type YogaInitialContext,
	createSchema,
	createYoga,
	useExtendContext,
} from "graphql-yoga";
import { createServer } from "node:http";
import { extendContext } from "./context.ts";
import { resolvers } from "./schema/resolvers.generated.ts";
import { typeDefs } from "./schema/typeDefs.generated.ts";
import { startWorker, stopWorkers } from "./workers.ts";

const signingKey = process.env.JWT_SECRET || "electric-kitten";
const port = process.env.PORT || 3000;

const pgConnection = await getConnection();
const drizzle = getDrizzle(pgConnection);

const yoga = createYoga({
	schema: createSchema({ typeDefs, resolvers }),
	plugins: [
		useCookies(),

		useJWT({
			singingKeyProviders: [createInlineSigningKeyProvider(signingKey)],
			tokenLookupLocations: [extractFromCookie({ name: "accessToken" })],
			tokenVerification: {
				issuer: "urn:space:issuer",
				audience: "urn:space:audience",
				algorithms: ["HS256", "RS256"],
			},
			extendContext: true,
			reject: {
				missingToken: false,
				invalidToken: false,
			},
		}),

		useExtendContext(
			async (
				context: YogaInitialContext & { jwt?: JWTExtendContextFields },
			) => {
				const claims = Object.fromEntries(
					Object.entries(context.jwt?.payload || {}).filter(([key]) =>
						key.startsWith("urn:space:"),
					),
				);

				return extendContext({
					drizzle,
					userId: context.jwt?.payload.sub,
					claims,
					startGame: startWorker,
				});
			},
		),
	],
	fetchAPI: globalThis,
});

const server = createServer(yoga);

server.listen(port, () => {
	console.log(
		`Server is running on http://localhost:${port}${yoga.graphqlEndpoint}`,
	);
});

drizzle.query.games
	.findMany({ where: isNotNull(games.startedAt), columns: { id: true } })
	.then((games) => {
		for (const game of games) {
			startWorker(game.id);
		}
	});

for (const signal of ["SIGHUP", "SIGINT", "SIGTERM"]) {
	process.on(signal, async () => {
		console.log("Stopping...");

		await Promise.all([
			new Promise((res) => server.close(res)),
			pgConnection.end(),
			stopWorkers(),
		]);

		process.exit(0);
	});
}
