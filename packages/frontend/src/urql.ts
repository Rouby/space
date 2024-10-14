import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, fetchExchange } from "urql";
import { graphql } from "./gql";
import type {
	CommisionTaskForceMutation,
	CommisionTaskForceMutationVariables,
	CreateGameMutation,
	CreateShipDesignMutation,
	CreateShipDesignMutationVariables,
	TaskForceCommisionFinishedSubSubscription,
	TrackMapSubscription,
	TrackMapSubscriptionVariables,
} from "./gql/graphql";
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
					createTaskForceCommision: (
						result: CommisionTaskForceMutation,
						args: CommisionTaskForceMutationVariables,
						cache,
					) => {
						const commisions = cache.resolve(
							{ __typename: "StarSystem", id: args.starSystemId },
							"taskForceCommisions",
						);
						if (Array.isArray(commisions)) {
							cache.link(
								{ __typename: "StarSystem", id: args.starSystemId },
								"taskForceCommisions",
								[...commisions, result.createTaskForceCommision],
							);
						}
					},
					createShipDesign: (
						result: CreateShipDesignMutation,
						{ gameId }: CreateShipDesignMutationVariables,
						cache,
						info,
					) => {
						const designs = cache.resolve(
							{
								__typename: "Player",
								id: `${gameId}-${info.variables.userId}`,
							},
							"shipDesigns",
						);
						if (Array.isArray(designs)) {
							cache.link(
								{
									__typename: "Player",
									id: `${gameId}-${info.variables.userId}`,
								},
								"shipDesigns",
								[...designs, result.createShipDesign],
							);
						}
					},
				},
				Subscription: {
					taskForceCommisionFinished: (
						result: TaskForceCommisionFinishedSubSubscription,
						_,
						cache,
					) => {
						cache.invalidate({
							__typename: "TaskForceCommision",
							id: result.taskForceCommisionFinished.id,
						});
					},
					trackGalaxy: (
						result: TrackMapSubscription,
						vars: TrackMapSubscriptionVariables,
						cache,
					) => {
						if (result.trackGalaxy.subject.__typename === "TaskForce") {
							if (
								result.trackGalaxy.__typename === "PositionableApppearsEvent" ||
								result.trackGalaxy.__typename === "PositionableDisappearsEvent"
							) {
								const remove =
									result.trackGalaxy.__typename ===
									"PositionableDisappearsEvent";

								const taskForces = cache.resolve(
									{ __typename: "Game", id: vars.gameId },
									"taskForces",
								) as string[];
								const cacheKey = cache.keyOfEntity(result.trackGalaxy.subject);

								if (cacheKey) {
									if (remove && taskForces.includes(cacheKey)) {
										cache.link(
											{ __typename: "Game", id: vars.gameId },
											"taskForces",
											taskForces.filter((id) => id !== cacheKey),
										);
									} else if (!remove && !taskForces.includes(cacheKey)) {
										cache.link(
											{ __typename: "Game", id: vars.gameId },
											"taskForces",
											[...taskForces, cacheKey],
										);
									}
								}
							}
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
