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
  BigInt: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Vector: { input: {x:number;y:number}; output: {x:number;y:number}; }
};

export type Dilemma = {
  __typename?: 'Dilemma';
  causation?: Maybe<Reference>;
  choices: Array<DilemmaChoice>;
  choosen?: Maybe<Scalars['ID']['output']>;
  correlation?: Maybe<Reference>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  position?: Maybe<Scalars['Vector']['output']>;
  question: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type DilemmaChoice = {
  __typename?: 'DilemmaChoice';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Discovery = ResourceDiscovery | UnknownDiscovery;

export type Game = {
  __typename?: 'Game';
  autoEndTurnAfterHoursInactive?: Maybe<Scalars['Int']['output']>;
  autoEndTurnEveryHours?: Maybe<Scalars['Int']['output']>;
  dilemmas: Array<Dilemma>;
  id: Scalars['ID']['output'];
  me?: Maybe<Player>;
  name: Scalars['String']['output'];
  players: Array<Player>;
  resources: Array<Resource>;
  shipComponents: Array<ShipComponent>;
  shipDesigns: Array<ShipDesign>;
  starSystems: Array<StarSystem>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  taskForces: Array<TaskForce>;
  turnNumber: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: Game;
  createShipDesign: ShipDesign;
  endTurn: Game;
  joinGame: Game;
  loginWithPassword: User;
  loginWithRefreshToken: User;
  makeDilemmaChoice: Dilemma;
  orderTaskForce: TaskForce;
  registerWithPassword: User;
  startGame: Game;
  updateGameSettings: Game;
  updatePlayer: Player;
};


export type MutationCreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateShipDesignArgs = {
  design: ShipDesignInput;
  gameId: Scalars['ID']['input'];
};


export type MutationEndTurnArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationJoinGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMakeDilemmaChoiceArgs = {
  choiceId: Scalars['ID']['input'];
  dilemmaId: Scalars['ID']['input'];
};


export type MutationOrderTaskForceArgs = {
  id: Scalars['ID']['input'];
  orders: Array<TaskForceOrderInput>;
  queue?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationRegisterWithPasswordArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationStartGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateGameSettingsArgs = {
  gameId: Scalars['ID']['input'];
  input: UpdateGameSettingsInput;
};


export type MutationUpdatePlayerArgs = {
  gameId: Scalars['ID']['input'];
  input: UpdatePlayerInput;
};

export type Player = {
  __typename?: 'Player';
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  resources: Array<Resource>;
  shipComponents: Array<ShipComponent>;
  shipDesigns: Array<ShipDesign>;
  turnEnded?: Maybe<Scalars['Boolean']['output']>;
  user: User;
};

export type Population = {
  __typename?: 'Population';
  amount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
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
  removed?: Maybe<Scalars['Boolean']['output']>;
  subject: Positionable;
};

export type PositionableMovesEvent = {
  __typename?: 'PositionableMovesEvent';
  subject: Positionable;
};

export type Query = {
  __typename?: 'Query';
  dilemma: Dilemma;
  game: Game;
  games: Array<Game>;
  me?: Maybe<User>;
  starSystem: StarSystem;
};


export type QueryDilemmaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStarSystemArgs = {
  id: Scalars['ID']['input'];
};

export type Reference = Dilemma | StarSystem;

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

export type ResourceDiscovery = {
  __typename?: 'ResourceDiscovery';
  id: Scalars['ID']['output'];
  miningRate: Scalars['Float']['output'];
  remainingDeposits: Scalars['Float']['output'];
  resource: Resource;
};

export type ShipComponent = {
  __typename?: 'ShipComponent';
  armorEffectivenessAgainst?: Maybe<ShipComponentEffectivenessAgainst>;
  armorThickness?: Maybe<Scalars['Float']['output']>;
  constructionCost: Scalars['Float']['output'];
  costs: Array<ResourceCost>;
  crewCapacity?: Maybe<Scalars['Float']['output']>;
  crewNeed: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  ftlSpeed?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  powerGeneration?: Maybe<Scalars['Float']['output']>;
  powerNeed: Scalars['Float']['output'];
  sensorPrecision?: Maybe<Scalars['Float']['output']>;
  sensorRange?: Maybe<Scalars['Float']['output']>;
  shieldEffectivenessAgainst?: Maybe<ShipComponentEffectivenessAgainst>;
  shieldStrength?: Maybe<Scalars['Float']['output']>;
  structuralIntegrity?: Maybe<Scalars['Float']['output']>;
  supplyCapacity?: Maybe<Scalars['Float']['output']>;
  supplyNeedCombat: Scalars['Float']['output'];
  supplyNeedMovement: Scalars['Float']['output'];
  supplyNeedPassive: Scalars['Float']['output'];
  thruster?: Maybe<Scalars['Float']['output']>;
  weaponAccuracy?: Maybe<Scalars['Float']['output']>;
  weaponArmorPenetration?: Maybe<Scalars['Float']['output']>;
  weaponCooldown?: Maybe<Scalars['Float']['output']>;
  weaponDamage?: Maybe<Scalars['Float']['output']>;
  weaponDeliveryType?: Maybe<WeaponDeliveryType>;
  weaponRange?: Maybe<Scalars['Float']['output']>;
  weaponShieldPenetration?: Maybe<Scalars['Float']['output']>;
  zoneOfControl?: Maybe<Scalars['Float']['output']>;
};

export type ShipComponentEffectivenessAgainst = {
  __typename?: 'ShipComponentEffectivenessAgainst';
  beam?: Maybe<Scalars['Float']['output']>;
  instant?: Maybe<Scalars['Float']['output']>;
  missile?: Maybe<Scalars['Float']['output']>;
  projectile?: Maybe<Scalars['Float']['output']>;
};

export type ShipDesign = {
  __typename?: 'ShipDesign';
  components: Array<ShipDesignComponent>;
  costs: Array<ResourceCost>;
  decommissioned: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: Player;
};

export type ShipDesignComponent = {
  __typename?: 'ShipDesignComponent';
  component: ShipComponent;
  id: Scalars['ID']['output'];
  position: Scalars['Vector']['output'];
};

export type ShipDesignComponentInput = {
  componentId: Scalars['ID']['input'];
  gridPosition: Scalars['Vector']['input'];
};

export type ShipDesignInput = {
  components: Array<ShipDesignComponentInput>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type StarSystem = Positionable & {
  __typename?: 'StarSystem';
  discoveries?: Maybe<Array<Discovery>>;
  discoveryProgress?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<Player>;
  populations?: Maybe<Array<Population>>;
  position: Scalars['Vector']['output'];
  sensorRange?: Maybe<Scalars['Float']['output']>;
  taskForces: Array<TaskForce>;
};

export type StarSystemUpdateEvent = {
  __typename?: 'StarSystemUpdateEvent';
  subject: StarSystem;
};

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackGame: TrackGameEvent;
  trackStarSystem: TrackStarSystemEvent;
};


export type SubscriptionTrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptionTrackGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptionTrackStarSystemArgs = {
  starSystemId: Scalars['ID']['input'];
};

export type TaskForce = Positionable & {
  __typename?: 'TaskForce';
  game: Game;
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  movementVector?: Maybe<Scalars['Vector']['output']>;
  name: Scalars['String']['output'];
  orders?: Maybe<Array<TaskForceOrder>>;
  owner?: Maybe<Player>;
  position: Scalars['Vector']['output'];
};

export type TaskForceColonizeOrder = TaskForceOrder & {
  __typename?: 'TaskForceColonizeOrder';
  id: Scalars['ID']['output'];
};

export type TaskForceFollowOrder = TaskForceOrder & {
  __typename?: 'TaskForceFollowOrder';
  id: Scalars['ID']['output'];
  taskForce: TaskForce;
};

export type TaskForceFollowOrderInput = {
  taskForceId: Scalars['ID']['input'];
};

export type TaskForceMoveOrder = TaskForceOrder & {
  __typename?: 'TaskForceMoveOrder';
  destination: Scalars['Vector']['output'];
  id: Scalars['ID']['output'];
};

export type TaskForceMoveOrderInput = {
  destination: Scalars['Vector']['input'];
};

export type TaskForceOrder = {
  id: Scalars['ID']['output'];
};

export type TaskForceOrderInput = {
  colonize?: InputMaybe<Scalars['Boolean']['input']>;
  follow?: InputMaybe<TaskForceFollowOrderInput>;
  move?: InputMaybe<TaskForceMoveOrderInput>;
};

export enum TaskForceShipRole {
  Capital = 'capital',
  Screen = 'screen',
  Support = 'support'
}

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent | StarSystemUpdateEvent;

export type TrackGameEvent = TurnEndedEvent;

export type TrackStarSystemEvent = StarSystemUpdateEvent;

export type TurnEndedEvent = {
  __typename?: 'TurnEndedEvent';
  game: Game;
};

export type UnknownDiscovery = {
  __typename?: 'UnknownDiscovery';
  id: Scalars['ID']['output'];
};

export type UpdateGameSettingsInput = {
  autoEndTurnAfterHoursInactive?: InputMaybe<Scalars['Int']['input']>;
  autoEndTurnEveryHours?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePlayerInput = {
  color?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export enum WeaponDeliveryType {
  Beam = 'beam',
  Instant = 'instant',
  Missile = 'missile',
  Projectile = 'projectile'
}

export type RefreshLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshLoginMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename?: 'User', id: string } };

export type CreateGameMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'Game', id: string, name: string } };

export type DilemmaDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DilemmaDetailsQuery = { __typename?: 'Query', dilemma: { __typename?: 'Dilemma', id: string, title: string, question: string, description: string, choosen?: string | null, position?: {x:number;y:number} | null, choices: Array<{ __typename?: 'DilemmaChoice', id: string, title: string, description: string }>, correlation?: { __typename?: 'Dilemma', id: string, title: string } | { __typename?: 'StarSystem', id: string, name: string } | null } };

export type MakeDilemmaChoiceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  choiceId: Scalars['ID']['input'];
}>;


export type MakeDilemmaChoiceMutation = { __typename?: 'Mutation', makeDilemmaChoice: { __typename?: 'Dilemma', id: string, title: string, choosen?: string | null } };

export type DilemmasListQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type DilemmasListQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, dilemmas: Array<{ __typename?: 'Dilemma', id: string, title: string, question: string }> } };

export type GalaxyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GalaxyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, starSystems: Array<{ __typename?: 'StarSystem', id: string, position: {x:number;y:number}, isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null }>, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, position: {x:number;y:number}, movementVector?: {x:number;y:number} | null, isVisible: boolean, lastUpdate?: any | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null, orders?: Array<{ __typename?: 'TaskForceColonizeOrder', id: string } | { __typename?: 'TaskForceFollowOrder', id: string } | { __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null }>, dilemmas: Array<{ __typename?: 'Dilemma', id: string, title: string, question: string, description: string, choosen?: string | null, position?: {x:number;y:number} | null, choices: Array<{ __typename?: 'DilemmaChoice', id: string, title: string, description: string }>, correlation?: { __typename?: 'Dilemma', id: string, title: string } | { __typename?: 'StarSystem', id: string, position: {x:number;y:number} } | null }> } };

export type OrderTaskForceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  orders: Array<TaskForceOrderInput> | TaskForceOrderInput;
  queue?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type OrderTaskForceMutation = { __typename?: 'Mutation', orderTaskForce: { __typename?: 'TaskForce', id: string, orders?: Array<{ __typename?: 'TaskForceColonizeOrder', id: string } | { __typename?: 'TaskForceFollowOrder', id: string } | { __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null } };

export type TrackMapSubscriptionVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type TrackMapSubscription = { __typename?: 'Subscription', trackGalaxy: { __typename?: 'PositionableApppearsEvent', subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number}, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, movementVector?: {x:number;y:number} | null, id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableDisappearsEvent', removed?: boolean | null, subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableMovesEvent', subject: { __typename: 'StarSystem', id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', movementVector?: {x:number;y:number} | null, id: string, position: {x:number;y:number} } } | { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null } } };

export type GameLobbyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GameLobbyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, name: string, startedAt?: any | null, autoEndTurnAfterHoursInactive?: number | null, autoEndTurnEveryHours?: number | null, players: Array<{ __typename?: 'Player', id: string, color: string, user: { __typename?: 'User', id: string, name: string } }> } };

export type StartGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'Game', id: string, startedAt?: any | null } };

export type UpdatePlayerMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
  input: UpdatePlayerInput;
}>;


export type UpdatePlayerMutation = { __typename?: 'Mutation', updatePlayer: { __typename?: 'Player', id: string, color: string } };

export type UpdateGameSettingsMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
  input: UpdateGameSettingsInput;
}>;


export type UpdateGameSettingsMutation = { __typename?: 'Mutation', updateGameSettings: { __typename?: 'Game', id: string, autoEndTurnAfterHoursInactive?: number | null, autoEndTurnEveryHours?: number | null } };

export type GamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', id: string, name: string, startedAt?: any | null, players: Array<{ __typename?: 'Player', id: string, name: string, color: string, user: { __typename?: 'User', id: string, name: string } }> }> };

export type JoinGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinGame: { __typename?: 'Game', id: string, name: string, startedAt?: any | null, players: Array<{ __typename?: 'Player', id: string, name: string, color: string, user: { __typename?: 'User', id: string, name: string } }> } };

export type NotificationCountQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type NotificationCountQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, dilemmas: Array<{ __typename?: 'Dilemma', id: string, choosen?: string | null }> } };

export type CurrentTurnEndedQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type CurrentTurnEndedQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, turnEnded?: boolean | null } | null } };

export type CurrentTurnSubscriptionVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type CurrentTurnSubscription = { __typename?: 'Subscription', trackGame: { __typename?: 'TurnEndedEvent', game: { __typename?: 'Game', id: string, turnNumber: number, players: Array<{ __typename?: 'Player', id: string, turnEnded?: boolean | null }> } } };

export type EndTurnMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type EndTurnMutation = { __typename?: 'Mutation', endTurn: { __typename?: 'Game', id: string } };

export type ShipComponentsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type ShipComponentsQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, shipComponents: Array<{ __typename?: 'ShipComponent', id: string, name: string, description: string, supplyNeedPassive: number, supplyNeedMovement: number, supplyNeedCombat: number, powerNeed: number, crewNeed: number, constructionCost: number, supplyCapacity?: number | null, powerGeneration?: number | null, crewCapacity?: number | null, ftlSpeed?: number | null, zoneOfControl?: number | null, sensorRange?: number | null, structuralIntegrity?: number | null, thruster?: number | null, sensorPrecision?: number | null, armorThickness?: number | null, shieldStrength?: number | null, weaponDamage?: number | null, weaponCooldown?: number | null, weaponRange?: number | null, weaponArmorPenetration?: number | null, weaponShieldPenetration?: number | null, weaponAccuracy?: number | null, weaponDeliveryType?: WeaponDeliveryType | null, costs: Array<{ __typename?: 'ResourceCost', quantity: number, resource: { __typename?: 'Resource', id: string, name: string } }>, armorEffectivenessAgainst?: { __typename?: 'ShipComponentEffectivenessAgainst', projectile?: number | null, missile?: number | null, beam?: number | null, instant?: number | null } | null, shieldEffectivenessAgainst?: { __typename?: 'ShipComponentEffectivenessAgainst', projectile?: number | null, missile?: number | null, beam?: number | null, instant?: number | null } | null }>, resources: Array<{ __typename?: 'Resource', id: string, name: string }> } | null } };

export type CreateShipDesignMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
  design: ShipDesignInput;
}>;


export type CreateShipDesignMutation = { __typename?: 'Mutation', createShipDesign: { __typename?: 'ShipDesign', id: string, name: string, costs: Array<{ __typename?: 'ResourceCost', quantity: number, resource: { __typename?: 'Resource', id: string, name: string } }> } };

export type ShipDesignsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type ShipDesignsQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, shipDesigns: Array<{ __typename?: 'ShipDesign', id: string, name: string, costs: Array<{ __typename?: 'ResourceCost', quantity: number, resource: { __typename?: 'Resource', id: string, name: string } }> }> } | null } };

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'User', id: string, name: string } };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', registerWithPassword: { __typename?: 'User', id: string, name: string } };

export type StarSystemDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StarSystemDetailsQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, name: string, position: {x:number;y:number}, discoveryProgress?: number | null, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, owner?: { __typename?: 'Player', id: string, name: string } | null }>, discoveries?: Array<{ __typename: 'ResourceDiscovery', id: string, remainingDeposits: number, miningRate: number, resource: { __typename?: 'Resource', id: string, name: string } } | { __typename: 'UnknownDiscovery', id: string }> | null, populations?: Array<{ __typename?: 'Population', id: string, amount: number }> | null } };

export type TrackStarSystemSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackStarSystemSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, discoveryProgress?: number | null, discoveries?: Array<{ __typename: 'ResourceDiscovery', id: string, remainingDeposits: number, miningRate: number, resource: { __typename?: 'Resource', id: string, name: string } } | { __typename: 'UnknownDiscovery', id: string }> | null, populations?: Array<{ __typename?: 'Population', id: string, amount: number }> | null } } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name: string, email: string } | null };

export type RefreshAuthMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAuthMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename: 'User', id: string } };


export const RefreshLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshLogin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshLoginMutation, RefreshLoginMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const DilemmaDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DilemmaDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dilemma"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"correlation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dilemma"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DilemmaDetailsQuery, DilemmaDetailsQueryVariables>;
export const MakeDilemmaChoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MakeDilemmaChoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"choiceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"makeDilemmaChoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dilemmaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"choiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"choiceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}}]}}]}}]} as unknown as DocumentNode<MakeDilemmaChoiceMutation, MakeDilemmaChoiceMutationVariables>;
export const DilemmasListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DilemmasList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}}]}}]}}]}}]} as unknown as DocumentNode<DilemmasListQuery, DilemmasListQueryVariables>;
export const GalaxyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Galaxy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"correlation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dilemma"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GalaxyQuery, GalaxyQueryVariables>;
export const OrderTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orders"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceOrderInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queue"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderTaskForce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"orders"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orders"}}},{"kind":"Argument","name":{"kind":"Name","value":"queue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderTaskForceMutation, OrderTaskForceMutationVariables>;
export const TrackMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackGalaxy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableApppearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableMovesEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableDisappearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"removed"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackMapSubscription, TrackMapSubscriptionVariables>;
export const GameLobbyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameLobby"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnAfterHoursInactive"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnEveryHours"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameLobbyQuery, GameLobbyQueryVariables>;
export const StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartGameMutation, StartGameMutationVariables>;
export const UpdatePlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlayerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerMutation, UpdatePlayerMutationVariables>;
export const UpdateGameSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGameSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnAfterHoursInactive"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnEveryHours"}}]}}]}}]} as unknown as DocumentNode<UpdateGameSettingsMutation, UpdateGameSettingsMutationVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const JoinGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const NotificationCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationCountQuery, NotificationCountQueryVariables>;
export const CurrentTurnEndedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentTurnEnded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnEnded"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentTurnEndedQuery, CurrentTurnEndedQueryVariables>;
export const CurrentTurnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CurrentTurn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TurnEndedEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnEnded"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CurrentTurnSubscription, CurrentTurnSubscriptionVariables>;
export const EndTurnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndTurn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endTurn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EndTurnMutation, EndTurnMutationVariables>;
export const ShipComponentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipComponents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipComponents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedPassive"}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedMovement"}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedCombat"}},{"kind":"Field","name":{"kind":"Name","value":"powerNeed"}},{"kind":"Field","name":{"kind":"Name","value":"crewNeed"}},{"kind":"Field","name":{"kind":"Name","value":"constructionCost"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"powerGeneration"}},{"kind":"Field","name":{"kind":"Name","value":"crewCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"ftlSpeed"}},{"kind":"Field","name":{"kind":"Name","value":"zoneOfControl"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}},{"kind":"Field","name":{"kind":"Name","value":"structuralIntegrity"}},{"kind":"Field","name":{"kind":"Name","value":"thruster"}},{"kind":"Field","name":{"kind":"Name","value":"sensorPrecision"}},{"kind":"Field","name":{"kind":"Name","value":"armorThickness"}},{"kind":"Field","name":{"kind":"Name","value":"armorEffectivenessAgainst"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectile"}},{"kind":"Field","name":{"kind":"Name","value":"missile"}},{"kind":"Field","name":{"kind":"Name","value":"beam"}},{"kind":"Field","name":{"kind":"Name","value":"instant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shieldStrength"}},{"kind":"Field","name":{"kind":"Name","value":"shieldEffectivenessAgainst"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectile"}},{"kind":"Field","name":{"kind":"Name","value":"missile"}},{"kind":"Field","name":{"kind":"Name","value":"beam"}},{"kind":"Field","name":{"kind":"Name","value":"instant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weaponDamage"}},{"kind":"Field","name":{"kind":"Name","value":"weaponCooldown"}},{"kind":"Field","name":{"kind":"Name","value":"weaponRange"}},{"kind":"Field","name":{"kind":"Name","value":"weaponArmorPenetration"}},{"kind":"Field","name":{"kind":"Name","value":"weaponShieldPenetration"}},{"kind":"Field","name":{"kind":"Name","value":"weaponAccuracy"}},{"kind":"Field","name":{"kind":"Name","value":"weaponDeliveryType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipComponentsQuery, ShipComponentsQueryVariables>;
export const CreateShipDesignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShipDesign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"design"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShipDesign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"design"},"value":{"kind":"Variable","name":{"kind":"Name","value":"design"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<CreateShipDesignMutation, CreateShipDesignMutationVariables>;
export const ShipDesignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipDesigns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipDesigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipDesignsQuery, ShipDesignsQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const StarSystemDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StarSystemDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"miningRate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveryProgress"}},{"kind":"Field","name":{"kind":"Name","value":"populations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]} as unknown as DocumentNode<StarSystemDetailsQuery, StarSystemDetailsQueryVariables>;
export const TrackStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discoveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"miningRate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveryProgress"}},{"kind":"Field","name":{"kind":"Name","value":"populations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackStarSystemSubscription, TrackStarSystemSubscriptionVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const RefreshAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshAuthMutation, RefreshAuthMutationVariables>;