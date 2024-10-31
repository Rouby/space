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
			keys: {
				ResourceCost: () => null,
				ResourceNeed: () => null,
			},
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
						const taskForces = cache.resolve(
							{ __typename: "StarSystem", id: args.commision.starSystemId },
							"taskForces",
						);
						if (Array.isArray(taskForces)) {
							cache.link(
								{ __typename: "StarSystem", id: args.commision.starSystemId },
								"taskForces",
								[...taskForces, result.createTaskForceCommision],
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
										"PositionableDisappearsEvent" && result.trackGalaxy.removed;

								const taskForces = cache.resolve(
									{ __typename: "Game", id: vars.gameId },
									"taskForces",
								) as string[];
								const cacheKey = cache.keyOfEntity(result.trackGalaxy.subject);

								if (cacheKey) {
									if (remove && taskForces.includes(cacheKey)) {
										cache.invalidate({
											__typename: "TaskForce",
											id: result.trackGalaxy.subject.id,
										});
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
						if (
							result.trackGalaxy.subject.__typename === "TaskForceEngagement"
						) {
							if (
								result.trackGalaxy.__typename ===
								"TaskForceJoinsEngagementEvent"
							) {
								const taskForceEngagements = cache.resolve(
									{ __typename: "Game", id: vars.gameId },
									"taskForceEngagements",
								) as string[];
								const cacheKey = cache.keyOfEntity(result.trackGalaxy.subject);

								if (cacheKey) {
									if (!taskForceEngagements.includes(cacheKey)) {
										cache.link(
											{ __typename: "Game", id: vars.gameId },
											"taskForceEngagements",
											[...taskForceEngagements, cacheKey],
										);
									}
								}

								const taskForces = cache.resolve(
									{ __typename: "Game", id: vars.gameId },
									"taskForces",
								) as string[];
								const removedTfs = result.trackGalaxy.subject.taskForces.map(
									(tf) => cache.keyOfEntity(tf),
								);
								if (taskForces.some((key) => removedTfs.includes(key))) {
									cache.link(
										{ __typename: "Game", id: vars.gameId },
										"taskForces",
										taskForces.filter((key) => !removedTfs.includes(key)),
									);
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
