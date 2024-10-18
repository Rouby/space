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

export type Discovery = ResourceDiscovery | UnknownDiscovery;

export type Game = {
  __typename?: 'Game';
  id: Scalars['ID']['output'];
  me?: Maybe<Player>;
  name: Scalars['String']['output'];
  players: Array<Player>;
  shipDesigns: Array<ShipDesign>;
  starSystems: Array<StarSystem>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  taskForces: Array<TaskForce>;
  tickRate: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: Game;
  createShipDesign: ShipDesign;
  createTaskForceCommision: TaskForce;
  joinGame: Game;
  loginWithPassword: User;
  loginWithRefreshToken: User;
  moveTaskForce: TaskForce;
  queueTaskForceMove: TaskForce;
  registerWithPassword: User;
  startGame: Game;
};


export type MutationCreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateShipDesignArgs = {
  design: ShipDesignInput;
  gameId: Scalars['ID']['input'];
};


export type MutationCreateTaskForceCommisionArgs = {
  commision: TaskForceCommisionInput;
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


export type MutationQueueTaskForceMoveArgs = {
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
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  shipDesigns: Array<ShipDesign>;
  user: User;
};

export type Positionable = {
  id: Scalars['ID']['output'];
  position: Scalars['Vector']['output'];
};

export type PositionableApppearsEvent = {
  __typename?: 'PositionableApppearsEvent';
  subject: Positionable;
};

export type PositionableDisappearsEvent = {
  __typename?: 'PositionableDisappearsEvent';
  subject: Positionable;
};

export type PositionableMovesEvent = {
  __typename?: 'PositionableMovesEvent';
  subject: Positionable;
};

export type Query = {
  __typename?: 'Query';
  game: Game;
  games: Array<Game>;
  me?: Maybe<User>;
  starSystem: StarSystem;
  taskForceShipCommision: TaskForceShipCommision;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStarSystemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaskForceShipCommisionArgs = {
  id: Scalars['ID']['input'];
};

export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ResourceCost = {
  __typename?: 'ResourceCost';
  quantity: Scalars['Float']['output'];
  resource: Resource;
};

export type ResourceDepot = {
  __typename?: 'ResourceDepot';
  id: Scalars['ID']['output'];
  quantity: Scalars['Float']['output'];
  resource: Resource;
};

export type ResourceDiscovery = {
  __typename?: 'ResourceDiscovery';
  id: Scalars['ID']['output'];
  miningRate: Scalars['Float']['output'];
  remainingDeposits: Scalars['Float']['output'];
  resource: Resource;
};

export type ResourceNeed = {
  __typename?: 'ResourceNeed';
  alotted: Scalars['Float']['output'];
  needed: Scalars['Float']['output'];
  resource: Resource;
};

export type ShipDesign = {
  __typename?: 'ShipDesign';
  armorRating: Scalars['Float']['output'];
  costs: Array<ResourceCost>;
  decommissioned: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  hullRating: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: Player;
  previousDesign?: Maybe<ShipDesign>;
  shieldRating: Scalars['Float']['output'];
  speedRating: Scalars['Float']['output'];
  supplyCapacity: Scalars['Float']['output'];
  supplyNeed: Scalars['Float']['output'];
  weaponRating: Scalars['Float']['output'];
  zoneOfControlRating: Scalars['Float']['output'];
};

export type ShipDesignInput = {
  armorRating: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  hullRating: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  previousDesignId?: InputMaybe<Scalars['ID']['input']>;
  shieldRating: Scalars['Float']['input'];
  speedRating: Scalars['Float']['input'];
  supplyCapacity: Scalars['Float']['input'];
  weaponRating: Scalars['Float']['input'];
  zoneOfControlRating: Scalars['Float']['input'];
};

export type StarSystem = Positionable & {
  __typename?: 'StarSystem';
  discoveries?: Maybe<Array<Discovery>>;
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<Player>;
  position: Scalars['Vector']['output'];
  resourceDepots?: Maybe<Array<ResourceDepot>>;
  sensorRange?: Maybe<Scalars['Float']['output']>;
  taskForceShipCommisions: Array<TaskForceShipCommision>;
  taskForces: Array<TaskForce>;
};

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackStarSystem: TrackStarSystemEvent;
};


export type SubscriptionTrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptionTrackStarSystemArgs = {
  starSystemId: Scalars['ID']['input'];
};

export type TaskForce = Positionable & {
  __typename?: 'TaskForce';
  commisions: Array<TaskForceShipCommision>;
  game: Game;
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  movementVector?: Maybe<Scalars['Vector']['output']>;
  name: Scalars['String']['output'];
  orders?: Maybe<Array<TaskForceOrder>>;
  owner?: Maybe<Player>;
  position: Scalars['Vector']['output'];
  sensorRange?: Maybe<Scalars['Float']['output']>;
  ships: Array<TaskForceShip>;
};

export type TaskForceCommisionInput = {
  name: Scalars['String']['input'];
  ships: Array<TaskForceCommisionShipInput>;
  starSystemId: Scalars['ID']['input'];
};

export type TaskForceCommisionShipInput = {
  name: Scalars['String']['input'];
  role: TaskForceShipRole;
  shipDesignId: Scalars['ID']['input'];
};

export type TaskForceMoveOrder = TaskForceOrder & {
  __typename?: 'TaskForceMoveOrder';
  destination: Scalars['Vector']['output'];
  id: Scalars['ID']['output'];
};

export type TaskForceOrder = {
  id: Scalars['ID']['output'];
};

export type TaskForceShip = {
  __typename?: 'TaskForceShip';
  armorState: Scalars['Float']['output'];
  hullState: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: TaskForceShipRole;
  shieldState: Scalars['Float']['output'];
  shipDesign: ShipDesign;
  supplyCarried: Scalars['Float']['output'];
  weaponState: Scalars['Float']['output'];
};

export type TaskForceShipCommision = {
  __typename?: 'TaskForceShipCommision';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  resourceNeeds: Array<ResourceNeed>;
  role: TaskForceShipRole;
  shipDesign: ShipDesign;
};

export type TaskForceShipCommisionProgressEvent = {
  __typename?: 'TaskForceShipCommisionProgressEvent';
  subject: TaskForceShipCommision;
};

export enum TaskForceShipRole {
  Capital = 'capital',
  Carrier = 'carrier',
  Scout = 'scout',
  Screen = 'screen',
  Support = 'support',
  Transport = 'transport'
}

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent;

export type TrackStarSystemEvent = TaskForceShipCommisionProgressEvent;

export type UnknownDiscovery = {
  __typename?: 'UnknownDiscovery';
  id: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type RefreshLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshLoginMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename?: 'User', id: string } };

export type GalaxyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GalaxyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, starSystems: Array<{ __typename?: 'StarSystem', id: string, position: {x:number;y:number}, isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null }>, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, position: {x:number;y:number}, movementVector?: {x:number;y:number} | null, isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null, orders?: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null }> } };

export type MoveTaskForceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  position: Scalars['Vector']['input'];
  queueOrder: Scalars['Boolean']['input'];
}>;


export type MoveTaskForceMutation = { __typename?: 'Mutation', moveTaskForce?: { __typename?: 'TaskForce', id: string, orders?: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null }, queueTaskForceMove?: { __typename?: 'TaskForce', id: string, orders?: Array<{ __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null } };

export type TrackMapSubscriptionVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type TrackMapSubscription = { __typename?: 'Subscription', trackGalaxy: { __typename?: 'PositionableApppearsEvent', subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, movementVector?: {x:number;y:number} | null, id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableDisappearsEvent', subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableMovesEvent', subject: { __typename: 'StarSystem', id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', movementVector?: {x:number;y:number} | null, id: string, position: {x:number;y:number} } } };

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

export type CreateShipDesignMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
  design: ShipDesignInput;
}>;


export type CreateShipDesignMutation = { __typename?: 'Mutation', createShipDesign: { __typename?: 'ShipDesign', id: string, name: string } };

export type ShipDesignsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type ShipDesignsQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, shipDesigns: Array<{ __typename?: 'ShipDesign', id: string, name: string, costs: Array<{ __typename?: 'ResourceCost', quantity: number, resource: { __typename?: 'Resource', id: string, name: string } }> }> } | null } };

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'User', id: string, name: string } };

export type CommisionTaskForceMutationVariables = Exact<{
  commision: TaskForceCommisionInput;
}>;


export type CommisionTaskForceMutation = { __typename?: 'Mutation', createTaskForceCommision: { __typename?: 'TaskForce', id: string } };

export type ShipDesignsForTaskForceQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type ShipDesignsForTaskForceQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, shipDesigns: Array<{ __typename?: 'ShipDesign', id: string, name: string }> } | null } };

export type StarSystemDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StarSystemDetailsQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, name: string, position: {x:number;y:number}, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, owner?: { __typename?: 'Player', id: string, name: string } | null }>, discoveries?: Array<{ __typename: 'ResourceDiscovery', id: string, remainingDeposits: number, miningRate: number, resource: { __typename?: 'Resource', id: string, name: string } } | { __typename: 'UnknownDiscovery', id: string }> | null, resourceDepots?: Array<{ __typename?: 'ResourceDepot', id: string, quantity: number, resource: { __typename?: 'Resource', id: string, name: string } }> | null } };

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
export const GalaxyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Galaxy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}}]}}]}}]} as unknown as DocumentNode<GalaxyQuery, GalaxyQueryVariables>;
export const MoveTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueOrder"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveTaskForce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueOrder"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"queueTaskForceMove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueOrder"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoveTaskForceMutation, MoveTaskForceMutationVariables>;
export const TrackMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackGalaxy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableApppearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableMovesEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableDisappearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackMapSubscription, TrackMapSubscriptionVariables>;
export const GameLobbyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameLobby"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameLobbyQuery, GameLobbyQueryVariables>;
export const StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartGameMutation, StartGameMutationVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const JoinGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const CreateShipDesignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShipDesign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"design"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShipDesign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"design"},"value":{"kind":"Variable","name":{"kind":"Name","value":"design"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateShipDesignMutation, CreateShipDesignMutationVariables>;
export const ShipDesignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipDesigns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipDesigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipDesignsQuery, ShipDesignsQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const CommisionTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommisionTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commision"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceCommisionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTaskForceCommision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commision"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commision"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CommisionTaskForceMutation, CommisionTaskForceMutationVariables>;
export const ShipDesignsForTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipDesignsForTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipDesigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipDesignsForTaskForceQuery, ShipDesignsForTaskForceQueryVariables>;
export const StarSystemDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StarSystemDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"miningRate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"resourceDepots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<StarSystemDetailsQuery, StarSystemDetailsQueryVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const RefreshAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshAuthMutation, RefreshAuthMutationVariables>;