import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { offlineExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { createClient, fetchExchange } from "urql";
import schema from "./gql/introspection.json";

export const client = createClient({
	url: "/graphql",
	exchanges: [
		devtoolsExchange,
		offlineExchange({
			storage: makeDefaultStorage({ idbName: "space-graphcache-v1" }),
			schema,
		}),
		authExchange(async (ctx) => ({
			addAuthToOperation(operation) {
				return operation;
			},
			didAuthError(error, operation) {
				return false;
			},
			async refreshAuth() {},
		})),
		fetchExchange,
	],
	suspense: true,
	fetchSubscriptions: true,
});
