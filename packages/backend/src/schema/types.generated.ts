import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DilemmaMapper } from './dilemma/schema.mappers.js';
import { GameMapper, PlayerMapper, TurnReportMapper, TurnReportMiningChangeMapper, TurnReportPopulationChangeMapper } from './game/schema.mappers.js';
import { PopulationMapper, ResourceDiscoveryMapper, StarSystemMapper, StarSystemColonizationMapper } from './starSystem/schema.mappers.js';
import { ResourceMapper, ResourceCostMapper } from './resource/schema.mappers.js';
import { ShipComponentMapper } from './shipComponent/schema.mappers.js';
import { ShipDesignMapper } from './shipDesign/schema.mappers.js';
import { TaskForceMapper, TaskForceColonizeOrderMapper, TaskForceFollowOrderMapper, TaskForceMoveOrderMapper, TaskForceOrderMapper } from './taskForce/schema.mappers.js';
import { Context } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: bigint; output: bigint; }
  DateTime: { input: Date | string; output: Date | string; }
  Vector: { input: {x:number;y:number}; output: {x:number;y:number}; }
};

export type ConstructTaskForceInput = {
  name: Scalars['String']['input'];
  shipDesignId: Scalars['ID']['input'];
  starSystemId: Scalars['ID']['input'];
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
  turnReports: Array<TurnReport>;
};


export type GameturnReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  constructTaskForce: TaskForce;
  createGame: Game;
  createShipDesign: ShipDesign;
  endTurn: Game;
  joinGame: Game;
  loginWithPassword: User;
  loginWithRefreshToken: User;
  makeDilemmaChoice: Dilemma;
  orderTaskForce: TaskForce;
  registerWithPassword: User;
  startColonization: StarSystem;
  startGame: Game;
  updateGameSettings: Game;
  updatePlayer: Player;
};


export type MutationconstructTaskForceArgs = {
  input: ConstructTaskForceInput;
};


export type MutationcreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationcreateShipDesignArgs = {
  design: ShipDesignInput;
  gameId: Scalars['ID']['input'];
};


export type MutationendTurnArgs = {
  expectedTurnNumber: Scalars['Int']['input'];
  gameId: Scalars['ID']['input'];
};


export type MutationjoinGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationloginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationmakeDilemmaChoiceArgs = {
  choiceId: Scalars['ID']['input'];
  dilemmaId: Scalars['ID']['input'];
};


export type MutationorderTaskForceArgs = {
  id: Scalars['ID']['input'];
  orders: Array<TaskForceOrderInput>;
  queue?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationregisterWithPasswordArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationstartColonizationArgs = {
  starSystemId: Scalars['ID']['input'];
};


export type MutationstartGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationupdateGameSettingsArgs = {
  gameId: Scalars['ID']['input'];
  input: UpdateGameSettingsInput;
};


export type MutationupdatePlayerArgs = {
  gameId: Scalars['ID']['input'];
  input: UpdatePlayerInput;
};

export type NewTurnCalculatedEvent = {
  __typename?: 'NewTurnCalculatedEvent';
  game: Game;
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


export type QuerydilemmaArgs = {
  id: Scalars['ID']['input'];
};


export type QuerygameArgs = {
  id: Scalars['ID']['input'];
};


export type QuerystarSystemArgs = {
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
  colonization?: Maybe<StarSystemColonization>;
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

export type StarSystemColonization = {
  __typename?: 'StarSystemColonization';
  dueTurn: Scalars['Int']['output'];
  originStarSystem: StarSystem;
  player: Player;
  startedAtTurn: Scalars['Int']['output'];
  turnsRemaining: Scalars['Int']['output'];
  turnsRequired: Scalars['Int']['output'];
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


export type SubscriptiontrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptiontrackGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptiontrackStarSystemArgs = {
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

export type TaskForceShipRole =
  | 'capital'
  | 'screen'
  | 'support';

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent | StarSystemUpdateEvent;

export type TrackGameEvent = NewTurnCalculatedEvent | TurnEndedEvent;

export type TrackStarSystemEvent = StarSystemUpdateEvent;

export type TurnEndedEvent = {
  __typename?: 'TurnEndedEvent';
  game: Game;
};

export type TurnReport = {
  __typename?: 'TurnReport';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  miningChanges: Array<TurnReportMiningChange>;
  populationChanges: Array<TurnReportPopulationChange>;
  turnNumber: Scalars['Int']['output'];
};

export type TurnReportMiningChange = {
  __typename?: 'TurnReportMiningChange';
  depotQuantity: Scalars['Float']['output'];
  mined: Scalars['Float']['output'];
  remainingDeposits: Scalars['Float']['output'];
  resourceId: Scalars['ID']['output'];
  starSystemId: Scalars['ID']['output'];
};

export type TurnReportPopulationChange = {
  __typename?: 'TurnReportPopulationChange';
  growth: Scalars['BigInt']['output'];
  newAmount: Scalars['BigInt']['output'];
  populationId: Scalars['ID']['output'];
  previousAmount: Scalars['BigInt']['output'];
  starSystemId: Scalars['ID']['output'];
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

export type WeaponDeliveryType =
  | 'beam'
  | 'instant'
  | 'missile'
  | 'projectile';



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  Discovery: ( ResourceDiscoveryMapper & { __typename: 'ResourceDiscovery' } ) | ( UnknownDiscovery & { __typename: 'UnknownDiscovery' } );
  Reference: ( DilemmaMapper & { __typename: 'Dilemma' } ) | ( StarSystemMapper & { __typename: 'StarSystem' } );
  TrackGalaxyEvent: ( Omit<PositionableApppearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableApppearsEvent' } ) | ( Omit<PositionableDisappearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableDisappearsEvent' } ) | ( Omit<PositionableMovesEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableMovesEvent' } ) | ( Omit<StarSystemUpdateEvent, 'subject'> & { subject: _RefType['StarSystem'] } & { __typename: 'StarSystemUpdateEvent' } );
  TrackGameEvent: ( Omit<NewTurnCalculatedEvent, 'game'> & { game: _RefType['Game'] } & { __typename: 'NewTurnCalculatedEvent' } ) | ( Omit<TurnEndedEvent, 'game'> & { game: _RefType['Game'] } & { __typename: 'TurnEndedEvent' } );
  TrackStarSystemEvent: ( Omit<StarSystemUpdateEvent, 'subject'> & { subject: _RefType['StarSystem'] } & { __typename: 'StarSystemUpdateEvent' } );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Positionable: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } );
  TaskForceOrder: ( TaskForceColonizeOrderMapper & { __typename: 'TaskForceColonizeOrder' } ) | ( TaskForceFollowOrderMapper & { __typename: 'TaskForceFollowOrder' } ) | ( TaskForceMoveOrderMapper & { __typename: 'TaskForceMoveOrder' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  ConstructTaskForceInput: ConstructTaskForceInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Dilemma: ResolverTypeWrapper<DilemmaMapper>;
  DilemmaChoice: ResolverTypeWrapper<DilemmaChoice>;
  Discovery: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Discovery']>;
  Game: ResolverTypeWrapper<GameMapper>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  NewTurnCalculatedEvent: ResolverTypeWrapper<Omit<NewTurnCalculatedEvent, 'game'> & { game: ResolversTypes['Game'] }>;
  Player: ResolverTypeWrapper<PlayerMapper>;
  Population: ResolverTypeWrapper<PopulationMapper>;
  Positionable: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Positionable']>;
  PositionableApppearsEvent: ResolverTypeWrapper<Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableDisappearsEvent: ResolverTypeWrapper<Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableMovesEvent: ResolverTypeWrapper<Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  Query: ResolverTypeWrapper<{}>;
  Reference: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Reference']>;
  Resource: ResolverTypeWrapper<ResourceMapper>;
  ResourceCost: ResolverTypeWrapper<ResourceCostMapper>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ResourceDiscovery: ResolverTypeWrapper<ResourceDiscoveryMapper>;
  ShipComponent: ResolverTypeWrapper<ShipComponentMapper>;
  ShipComponentEffectivenessAgainst: ResolverTypeWrapper<ShipComponentEffectivenessAgainst>;
  ShipDesign: ResolverTypeWrapper<ShipDesignMapper>;
  ShipDesignComponent: ResolverTypeWrapper<Omit<ShipDesignComponent, 'component'> & { component: ResolversTypes['ShipComponent'] }>;
  ShipDesignComponentInput: ShipDesignComponentInput;
  ShipDesignInput: ShipDesignInput;
  StarSystem: ResolverTypeWrapper<StarSystemMapper>;
  StarSystemColonization: ResolverTypeWrapper<StarSystemColonizationMapper>;
  StarSystemUpdateEvent: ResolverTypeWrapper<Omit<StarSystemUpdateEvent, 'subject'> & { subject: ResolversTypes['StarSystem'] }>;
  Subscription: ResolverTypeWrapper<{}>;
  TaskForce: ResolverTypeWrapper<TaskForceMapper>;
  TaskForceColonizeOrder: ResolverTypeWrapper<TaskForceColonizeOrderMapper>;
  TaskForceFollowOrder: ResolverTypeWrapper<TaskForceFollowOrderMapper>;
  TaskForceFollowOrderInput: TaskForceFollowOrderInput;
  TaskForceMoveOrder: ResolverTypeWrapper<TaskForceMoveOrderMapper>;
  TaskForceMoveOrderInput: TaskForceMoveOrderInput;
  TaskForceOrder: ResolverTypeWrapper<TaskForceOrderMapper>;
  TaskForceOrderInput: TaskForceOrderInput;
  TaskForceShipRole: ResolverTypeWrapper<'capital' | 'screen' | 'support'>;
  TrackGalaxyEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackGalaxyEvent']>;
  TrackGameEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackGameEvent']>;
  TrackStarSystemEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackStarSystemEvent']>;
  TurnEndedEvent: ResolverTypeWrapper<Omit<TurnEndedEvent, 'game'> & { game: ResolversTypes['Game'] }>;
  TurnReport: ResolverTypeWrapper<TurnReportMapper>;
  TurnReportMiningChange: ResolverTypeWrapper<TurnReportMiningChangeMapper>;
  TurnReportPopulationChange: ResolverTypeWrapper<TurnReportPopulationChangeMapper>;
  UnknownDiscovery: ResolverTypeWrapper<UnknownDiscovery>;
  UpdateGameSettingsInput: UpdateGameSettingsInput;
  UpdatePlayerInput: UpdatePlayerInput;
  User: ResolverTypeWrapper<User>;
  Vector: ResolverTypeWrapper<Scalars['Vector']['output']>;
  WeaponDeliveryType: ResolverTypeWrapper<'projectile' | 'beam' | 'missile' | 'instant'>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  ConstructTaskForceInput: ConstructTaskForceInput;
  String: Scalars['String']['output'];
  ID: Scalars['ID']['output'];
  DateTime: Scalars['DateTime']['output'];
  Dilemma: DilemmaMapper;
  DilemmaChoice: DilemmaChoice;
  Discovery: ResolversUnionTypes<ResolversParentTypes>['Discovery'];
  Game: GameMapper;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Boolean: Scalars['Boolean']['output'];
  NewTurnCalculatedEvent: Omit<NewTurnCalculatedEvent, 'game'> & { game: ResolversParentTypes['Game'] };
  Player: PlayerMapper;
  Population: PopulationMapper;
  Positionable: ResolversInterfaceTypes<ResolversParentTypes>['Positionable'];
  PositionableApppearsEvent: Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableDisappearsEvent: Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableMovesEvent: Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  Query: {};
  Reference: ResolversUnionTypes<ResolversParentTypes>['Reference'];
  Resource: ResourceMapper;
  ResourceCost: ResourceCostMapper;
  Float: Scalars['Float']['output'];
  ResourceDiscovery: ResourceDiscoveryMapper;
  ShipComponent: ShipComponentMapper;
  ShipComponentEffectivenessAgainst: ShipComponentEffectivenessAgainst;
  ShipDesign: ShipDesignMapper;
  ShipDesignComponent: Omit<ShipDesignComponent, 'component'> & { component: ResolversParentTypes['ShipComponent'] };
  ShipDesignComponentInput: ShipDesignComponentInput;
  ShipDesignInput: ShipDesignInput;
  StarSystem: StarSystemMapper;
  StarSystemColonization: StarSystemColonizationMapper;
  StarSystemUpdateEvent: Omit<StarSystemUpdateEvent, 'subject'> & { subject: ResolversParentTypes['StarSystem'] };
  Subscription: {};
  TaskForce: TaskForceMapper;
  TaskForceColonizeOrder: TaskForceColonizeOrderMapper;
  TaskForceFollowOrder: TaskForceFollowOrderMapper;
  TaskForceFollowOrderInput: TaskForceFollowOrderInput;
  TaskForceMoveOrder: TaskForceMoveOrderMapper;
  TaskForceMoveOrderInput: TaskForceMoveOrderInput;
  TaskForceOrder: TaskForceOrderMapper;
  TaskForceOrderInput: TaskForceOrderInput;
  TrackGalaxyEvent: ResolversUnionTypes<ResolversParentTypes>['TrackGalaxyEvent'];
  TrackGameEvent: ResolversUnionTypes<ResolversParentTypes>['TrackGameEvent'];
  TrackStarSystemEvent: ResolversUnionTypes<ResolversParentTypes>['TrackStarSystemEvent'];
  TurnEndedEvent: Omit<TurnEndedEvent, 'game'> & { game: ResolversParentTypes['Game'] };
  TurnReport: TurnReportMapper;
  TurnReportMiningChange: TurnReportMiningChangeMapper;
  TurnReportPopulationChange: TurnReportPopulationChangeMapper;
  UnknownDiscovery: UnknownDiscovery;
  UpdateGameSettingsInput: UpdateGameSettingsInput;
  UpdatePlayerInput: UpdatePlayerInput;
  User: User;
  Vector: Scalars['Vector']['output'];
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DilemmaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Dilemma'] = ResolversParentTypes['Dilemma']> = {
  causation?: Resolver<Maybe<ResolversTypes['Reference']>, ParentType, ContextType>;
  choices?: Resolver<Array<ResolversTypes['DilemmaChoice']>, ParentType, ContextType>;
  choosen?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  correlation?: Resolver<Maybe<ResolversTypes['Reference']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Vector']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DilemmaChoiceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DilemmaChoice'] = ResolversParentTypes['DilemmaChoice']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DiscoveryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Discovery'] = ResolversParentTypes['Discovery']> = {
  __resolveType?: TypeResolveFn<'ResourceDiscovery' | 'UnknownDiscovery', ParentType, ContextType>;
};

export type GameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  autoEndTurnAfterHoursInactive?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  autoEndTurnEveryHours?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  dilemmas?: Resolver<Array<ResolversTypes['Dilemma']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  resources?: Resolver<Array<ResolversTypes['Resource']>, ParentType, ContextType>;
  shipComponents?: Resolver<Array<ResolversTypes['ShipComponent']>, ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  starSystems?: Resolver<Array<ResolversTypes['StarSystem']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  turnNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnReports?: Resolver<Array<ResolversTypes['TurnReport']>, ParentType, ContextType, RequireFields<GameturnReportsArgs, 'limit'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  constructTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationconstructTaskForceArgs, 'input'>>;
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationcreateGameArgs, 'name'>>;
  createShipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType, RequireFields<MutationcreateShipDesignArgs, 'design' | 'gameId'>>;
  endTurn?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationendTurnArgs, 'expectedTurnNumber' | 'gameId'>>;
  joinGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationjoinGameArgs, 'id'>>;
  loginWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationloginWithPasswordArgs, 'email' | 'password'>>;
  loginWithRefreshToken?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  makeDilemmaChoice?: Resolver<ResolversTypes['Dilemma'], ParentType, ContextType, RequireFields<MutationmakeDilemmaChoiceArgs, 'choiceId' | 'dilemmaId'>>;
  orderTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationorderTaskForceArgs, 'id' | 'orders'>>;
  registerWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationregisterWithPasswordArgs, 'email' | 'name' | 'password'>>;
  startColonization?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<MutationstartColonizationArgs, 'starSystemId'>>;
  startGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationstartGameArgs, 'id'>>;
  updateGameSettings?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationupdateGameSettingsArgs, 'gameId' | 'input'>>;
  updatePlayer?: Resolver<ResolversTypes['Player'], ParentType, ContextType, RequireFields<MutationupdatePlayerArgs, 'gameId' | 'input'>>;
};

export type NewTurnCalculatedEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NewTurnCalculatedEvent'] = ResolversParentTypes['NewTurnCalculatedEvent']> = {
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resources?: Resolver<Array<ResolversTypes['Resource']>, ParentType, ContextType>;
  shipComponents?: Resolver<Array<ResolversTypes['ShipComponent']>, ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  turnEnded?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PopulationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Population'] = ResolversParentTypes['Population']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PositionableResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Positionable'] = ResolversParentTypes['Positionable']> = {
  __resolveType?: TypeResolveFn<'StarSystem' | 'TaskForce', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
};

export type PositionableApppearsEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PositionableApppearsEvent'] = ResolversParentTypes['PositionableApppearsEvent']> = {
  subject?: Resolver<ResolversTypes['Positionable'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PositionableDisappearsEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PositionableDisappearsEvent'] = ResolversParentTypes['PositionableDisappearsEvent']> = {
  removed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['Positionable'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PositionableMovesEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PositionableMovesEvent'] = ResolversParentTypes['PositionableMovesEvent']> = {
  subject?: Resolver<ResolversTypes['Positionable'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dilemma?: Resolver<ResolversTypes['Dilemma'], ParentType, ContextType, RequireFields<QuerydilemmaArgs, 'id'>>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<QuerygameArgs, 'id'>>;
  games?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<QuerystarSystemArgs, 'id'>>;
};

export type ReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Reference'] = ResolversParentTypes['Reference']> = {
  __resolveType?: TypeResolveFn<'Dilemma' | 'StarSystem', ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceCostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceCost'] = ResolversParentTypes['ResourceCost']> = {
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceDiscoveryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceDiscovery'] = ResolversParentTypes['ResourceDiscovery']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  miningRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  remainingDeposits?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipComponentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipComponent'] = ResolversParentTypes['ShipComponent']> = {
  armorEffectivenessAgainst?: Resolver<Maybe<ResolversTypes['ShipComponentEffectivenessAgainst']>, ParentType, ContextType>;
  armorThickness?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  constructionCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  costs?: Resolver<Array<ResolversTypes['ResourceCost']>, ParentType, ContextType>;
  crewCapacity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  crewNeed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ftlSpeed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  powerGeneration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  powerNeed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sensorPrecision?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sensorRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  shieldEffectivenessAgainst?: Resolver<Maybe<ResolversTypes['ShipComponentEffectivenessAgainst']>, ParentType, ContextType>;
  shieldStrength?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  structuralIntegrity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  supplyCapacity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  supplyNeedCombat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  supplyNeedMovement?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  supplyNeedPassive?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  thruster?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponAccuracy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponArmorPenetration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponCooldown?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponDamage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponDeliveryType?: Resolver<Maybe<ResolversTypes['WeaponDeliveryType']>, ParentType, ContextType>;
  weaponRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weaponShieldPenetration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  zoneOfControl?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipComponentEffectivenessAgainstResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipComponentEffectivenessAgainst'] = ResolversParentTypes['ShipComponentEffectivenessAgainst']> = {
  beam?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  instant?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  missile?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  projectile?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipDesignResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipDesign'] = ResolversParentTypes['ShipDesign']> = {
  components?: Resolver<Array<ResolversTypes['ShipDesignComponent']>, ParentType, ContextType>;
  costs?: Resolver<Array<ResolversTypes['ResourceCost']>, ParentType, ContextType>;
  decommissioned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipDesignComponentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipDesignComponent'] = ResolversParentTypes['ShipDesignComponent']> = {
  component?: Resolver<ResolversTypes['ShipComponent'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystem'] = ResolversParentTypes['StarSystem']> = {
  colonization?: Resolver<Maybe<ResolversTypes['StarSystemColonization']>, ParentType, ContextType>;
  discoveries?: Resolver<Maybe<Array<ResolversTypes['Discovery']>>, ParentType, ContextType>;
  discoveryProgress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  populations?: Resolver<Maybe<Array<ResolversTypes['Population']>>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  sensorRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemColonizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystemColonization'] = ResolversParentTypes['StarSystemColonization']> = {
  dueTurn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  originStarSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  startedAtTurn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnsRequired?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemUpdateEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystemUpdateEvent'] = ResolversParentTypes['StarSystemUpdateEvent']> = {
  subject?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  trackGalaxy?: SubscriptionResolver<ResolversTypes['TrackGalaxyEvent'], "trackGalaxy", ParentType, ContextType, RequireFields<SubscriptiontrackGalaxyArgs, 'gameId'>>;
  trackGame?: SubscriptionResolver<ResolversTypes['TrackGameEvent'], "trackGame", ParentType, ContextType, RequireFields<SubscriptiontrackGameArgs, 'gameId'>>;
  trackStarSystem?: SubscriptionResolver<ResolversTypes['TrackStarSystemEvent'], "trackStarSystem", ParentType, ContextType, RequireFields<SubscriptiontrackStarSystemArgs, 'starSystemId'>>;
};

export type TaskForceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForce'] = ResolversParentTypes['TaskForce']> = {
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  movementVector?: Resolver<Maybe<ResolversTypes['Vector']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<ResolversTypes['TaskForceOrder']>>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceColonizeOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceColonizeOrder'] = ResolversParentTypes['TaskForceColonizeOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceFollowOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceFollowOrder'] = ResolversParentTypes['TaskForceFollowOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceMoveOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceMoveOrder'] = ResolversParentTypes['TaskForceMoveOrder']> = {
  destination?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceOrder'] = ResolversParentTypes['TaskForceOrder']> = {
  __resolveType?: TypeResolveFn<'TaskForceColonizeOrder' | 'TaskForceFollowOrder' | 'TaskForceMoveOrder', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type TaskForceShipRoleResolvers = EnumResolverSignature<{ capital?: any, screen?: any, support?: any }, ResolversTypes['TaskForceShipRole']>;

export type TrackGalaxyEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackGalaxyEvent'] = ResolversParentTypes['TrackGalaxyEvent']> = {
  __resolveType?: TypeResolveFn<'PositionableApppearsEvent' | 'PositionableDisappearsEvent' | 'PositionableMovesEvent' | 'StarSystemUpdateEvent', ParentType, ContextType>;
};

export type TrackGameEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackGameEvent'] = ResolversParentTypes['TrackGameEvent']> = {
  __resolveType?: TypeResolveFn<'NewTurnCalculatedEvent' | 'TurnEndedEvent', ParentType, ContextType>;
};

export type TrackStarSystemEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackStarSystemEvent'] = ResolversParentTypes['TrackStarSystemEvent']> = {
  __resolveType?: TypeResolveFn<'StarSystemUpdateEvent', ParentType, ContextType>;
};

export type TurnEndedEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnEndedEvent'] = ResolversParentTypes['TurnEndedEvent']> = {
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReport'] = ResolversParentTypes['TurnReport']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  miningChanges?: Resolver<Array<ResolversTypes['TurnReportMiningChange']>, ParentType, ContextType>;
  populationChanges?: Resolver<Array<ResolversTypes['TurnReportPopulationChange']>, ParentType, ContextType>;
  turnNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportMiningChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportMiningChange'] = ResolversParentTypes['TurnReportMiningChange']> = {
  depotQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  mined?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  remainingDeposits?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resourceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  starSystemId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportPopulationChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportPopulationChange'] = ResolversParentTypes['TurnReportPopulationChange']> = {
  growth?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  newAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  populationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  previousAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  starSystemId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnknownDiscoveryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnknownDiscovery'] = ResolversParentTypes['UnknownDiscovery']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VectorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Vector'], any> {
  name: 'Vector';
}

export type WeaponDeliveryTypeResolvers = EnumResolverSignature<{ beam?: any, instant?: any, missile?: any, projectile?: any }, ResolversTypes['WeaponDeliveryType']>;

export type Resolvers<ContextType = Context> = {
  BigInt?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Dilemma?: DilemmaResolvers<ContextType>;
  DilemmaChoice?: DilemmaChoiceResolvers<ContextType>;
  Discovery?: DiscoveryResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NewTurnCalculatedEvent?: NewTurnCalculatedEventResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Population?: PopulationResolvers<ContextType>;
  Positionable?: PositionableResolvers<ContextType>;
  PositionableApppearsEvent?: PositionableApppearsEventResolvers<ContextType>;
  PositionableDisappearsEvent?: PositionableDisappearsEventResolvers<ContextType>;
  PositionableMovesEvent?: PositionableMovesEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reference?: ReferenceResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  ResourceCost?: ResourceCostResolvers<ContextType>;
  ResourceDiscovery?: ResourceDiscoveryResolvers<ContextType>;
  ShipComponent?: ShipComponentResolvers<ContextType>;
  ShipComponentEffectivenessAgainst?: ShipComponentEffectivenessAgainstResolvers<ContextType>;
  ShipDesign?: ShipDesignResolvers<ContextType>;
  ShipDesignComponent?: ShipDesignComponentResolvers<ContextType>;
  StarSystem?: StarSystemResolvers<ContextType>;
  StarSystemColonization?: StarSystemColonizationResolvers<ContextType>;
  StarSystemUpdateEvent?: StarSystemUpdateEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskForce?: TaskForceResolvers<ContextType>;
  TaskForceColonizeOrder?: TaskForceColonizeOrderResolvers<ContextType>;
  TaskForceFollowOrder?: TaskForceFollowOrderResolvers<ContextType>;
  TaskForceMoveOrder?: TaskForceMoveOrderResolvers<ContextType>;
  TaskForceOrder?: TaskForceOrderResolvers<ContextType>;
  TaskForceShipRole?: TaskForceShipRoleResolvers;
  TrackGalaxyEvent?: TrackGalaxyEventResolvers<ContextType>;
  TrackGameEvent?: TrackGameEventResolvers<ContextType>;
  TrackStarSystemEvent?: TrackStarSystemEventResolvers<ContextType>;
  TurnEndedEvent?: TurnEndedEventResolvers<ContextType>;
  TurnReport?: TurnReportResolvers<ContextType>;
  TurnReportMiningChange?: TurnReportMiningChangeResolvers<ContextType>;
  TurnReportPopulationChange?: TurnReportPopulationChangeResolvers<ContextType>;
  UnknownDiscovery?: UnknownDiscoveryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vector?: GraphQLScalarType;
  WeaponDeliveryType?: WeaponDeliveryTypeResolvers;
};

