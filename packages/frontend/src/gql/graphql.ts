/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Vector: { input: {x:number;y:number}; output: {x:number;y:number}; }
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
  starSystems: Array<StarSystem>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  taskForces: Array<TaskForce>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: Game;
  createTaskForceCommision: TaskForceCommision;
  joinGame: Game;
  loginWithPassword: User;
  loginWithRefreshToken: User;
  moveTaskForce: TaskForce;
  registerWithPassword: User;
  startGame: Game;
};


export type MutationCreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateTaskForceCommisionArgs = {
  starSystemId: Scalars['ID']['input'];
};


export type MutationJoinGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMoveTaskForceArgs = {
  id: Scalars['ID']['input'];
  position: Scalars['Vector']['input'];
};


export type MutationRegisterWithPasswordArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationStartGameArgs = {
  id: Scalars['ID']['input'];
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['ID']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  game: Game;
  games: Array<Game>;
  me?: Maybe<User>;
  starSystem: StarSystem;
  taskForceCommision: TaskForceCommision;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStarSystemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaskForceCommisionArgs = {
  id: Scalars['ID']['input'];
};

export type StarSystem = {
  __typename?: 'StarSystem';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  position: Scalars['Vector']['output'];
  taskForceCommisions: Array<TaskForceCommision>;
  taskForces: Array<TaskForce>;
};

export type Subscription = {
  __typename?: 'Subscription';
  taskForceCommisionFinished: TaskForceCommisionFinished;
  taskForceCommisionProgress: TaskForceCommision;
  trackTaskForces: TaskForce;
};


export type SubscriptionTaskForceCommisionFinishedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionTaskForceCommisionProgressArgs = {
  id: Scalars['ID']['input'];
};

export type TaskForce = {
  __typename?: 'TaskForce';
  id: Scalars['ID']['output'];
  movementVector?: Maybe<Scalars['Vector']['output']>;
  name: Scalars['String']['output'];
  orders: Array<TaskForceOrder>;
  owner: User;
  position: Scalars['Vector']['output'];
};

export type TaskForceCommision = {
  __typename?: 'TaskForceCommision';
  id: Scalars['ID']['output'];
  progress: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type TaskForceCommisionFinished = {
  __typename?: 'TaskForceCommisionFinished';
  id: Scalars['ID']['output'];
  taskForce?: Maybe<TaskForce>;
};

export type TaskForceMoveOrder = TaskForceOrder & {
  __typename?: 'TaskForceMoveOrder';
  destination: Scalars['Vector']['output'];
  id: Scalars['ID']['output'];
  type: TaskForceOrderType;
};

export type TaskForceOrder = {
  id: Scalars['ID']['output'];
  type: TaskForceOrderType;
};

export enum TaskForceOrderType {
  Move = 'move'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type RefreshLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshLoginMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename?: 'User', id: string } };

export type CommisionTaskForceMutationVariables = Exact<{
  starSystemId: Scalars['ID']['input'];
}>;


export type CommisionTaskForceMutation = { __typename?: 'Mutation', createTaskForceCommision: { __typename?: 'TaskForceCommision', id: string, progress: number, total: number } };

export type StarSystemDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StarSystemDetailsQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, name: string, position: {x:number;y:number}, taskForceCommisions: Array<{ __typename?: 'TaskForceCommision', id: string, progress: number, total: number }>, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, owner: { __typename?: 'User', id: string, name: string } }> } };

export type TaskForceCommisionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskForceCommisionQuery = { __typename?: 'Query', taskForceCommision: { __typename?: 'TaskForceCommision', id: string, progress: number, total: number } };

export type TaskForceCommisionSubSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskForceCommisionSubSubscription = { __typename?: 'Subscription', taskForceCommisionProgress: { __typename?: 'TaskForceCommision', id: string, progress: number, total: number } };

export type TaskForceCommisionFinishedSubSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskForceCommisionFinishedSubSubscription = { __typename?: 'Subscription', taskForceCommisionFinished: { __typename?: 'TaskForceCommisionFinished', id: string, taskForce?: { __typename?: 'TaskForce', id: string, position: {x:number;y:number}, owner: { __typename?: 'User', id: string, name: string } } | null } };

export type GalaxyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GalaxyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, starSystems: Array<{ __typename?: 'StarSystem', id: string, position: {x:number;y:number}, owner?: { __typename?: 'User', id: string, name: string } | null }>, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, position: {x:number;y:number}, movementVector?: {x:number;y:number} | null, owner: { __typename?: 'User', id: string, name: string }, orders: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string, type: TaskForceOrderType }> }> } };

export type MoveTaskForceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  position: Scalars['Vector']['input'];
}>;


export type MoveTaskForceMutation = { __typename?: 'Mutation', moveTaskForce: { __typename?: 'TaskForce', id: string, orders: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string, type: TaskForceOrderType }> } };

export type TaskForceMovementsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TaskForceMovementsSubscription = { __typename?: 'Subscription', trackTaskForces: { __typename?: 'TaskForce', id: string, position: {x:number;y:number}, movementVector?: {x:number;y:number} | null, orders: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string, type: TaskForceOrderType }> } };

export type GameLobbyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GameLobbyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, user: { __typename?: 'User', id: string, name: string } }> } };

export type StartGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'Game', id: string, startedAt?: any | null } };

export type GamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', id: string, name: string, startedAt?: any | null, players: Array<{ __typename?: 'Player', id: string, user: { __typename?: 'User', id: string, name: string } }> }> };

export type JoinGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinGame: { __typename?: 'Game', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, user: { __typename?: 'User', id: string, name: string } }> } };

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'User', id: string, name: string } };

export type CreateGameMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'Game', id: string, name: string } };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', registerWithPassword: { __typename?: 'User', id: string, name: string } };

export type RefreshAuthMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAuthMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename: 'User', id: string } };


export const RefreshLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshLogin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshLoginMutation, RefreshLoginMutationVariables>;
export const CommisionTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommisionTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTaskForceCommision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<CommisionTaskForceMutation, CommisionTaskForceMutationVariables>;
export const StarSystemDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StarSystemDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceCommisions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StarSystemDetailsQuery, StarSystemDetailsQueryVariables>;
export const TaskForceCommisionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskForceCommision"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceCommision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<TaskForceCommisionQuery, TaskForceCommisionQueryVariables>;
export const TaskForceCommisionSubDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TaskForceCommisionSub"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceCommisionProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<TaskForceCommisionSubSubscription, TaskForceCommisionSubSubscriptionVariables>;
export const TaskForceCommisionFinishedSubDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TaskForceCommisionFinishedSub"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceCommisionFinished"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskForce"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaskForceCommisionFinishedSubSubscription, TaskForceCommisionFinishedSubSubscriptionVariables>;
export const GalaxyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Galaxy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}}]}}]}}]} as unknown as DocumentNode<GalaxyQuery, GalaxyQueryVariables>;
export const MoveTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveTaskForce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoveTaskForceMutation, MoveTaskForceMutationVariables>;
export const TaskForceMovementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TaskForceMovements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackTaskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}}]}}]} as unknown as DocumentNode<TaskForceMovementsSubscription, TaskForceMovementsSubscriptionVariables>;
export const GameLobbyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameLobby"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameLobbyQuery, GameLobbyQueryVariables>;
export const StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartGameMutation, StartGameMutationVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const JoinGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const RefreshAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshAuthMutation, RefreshAuthMutationVariables>;