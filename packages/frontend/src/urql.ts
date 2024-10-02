import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, fetchExchange } from "urql";
import { graphql } from "./gql";
import type { CreateGameMutation } from "./gql/graphql";
import schema from "./gql/introspection.json";

export const client = createClient({
	url: "/graphql",
	exchanges: [
		devtoolsExchange,
		cacheExchange({
			schema,
			updates: {
				Mutation: {
					loginWithPassword: (_, __, cache) => {
						cache.invalidate("Query", "me");
					},
					registerWithPassword: (_, __, cache) => {
						cache.invalidate("Query", "me");
					},
					createGame: (result: CreateGameMutation, __, cache) => {
						const games = cache.resolve("Query", "games");
						if (Array.isArray(games)) {
							cache.link("Query", "games", [...games, result.createGame]);
						}
					},
				},
			},
		}),
		authExchange(async (utils) => ({
			addAuthToOperation(operation) {
				return operation;
			},
			didAuthError(error) {
				return error.graphQLErrors.some(
					(err) => err.extensions.code === "NOT_AUTHORIZED",
				);
			},
			async refreshAuth() {
				await utils.mutate(
					graphql(`
					mutation RefreshAuth {
						loginWithRefreshToken {
							__typename
							id
						}
					}`),
					{},
				);
			},
		})),
		fetchExchange,
	],
	suspense: true,
	fetchSubscriptions: true,
	requestPolicy: "cache-and-network",
});
