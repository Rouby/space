import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GameMapper, PlayerMapper } from './game/schema.mappers.js';
import { PopulationMapper, ResourceDepotMapper, ResourceDiscoveryMapper, StarSystemMapper } from './starSystem/schema.mappers.js';
import { ResourceMapper, ResourceNeedMapper } from './resource/schema.mappers.js';
import { ResourceCostMapper, ShipDesignMapper } from './shipDesign/schema.mappers.js';
import { ShipComponentMapper } from './shipComponent/schema.mappers.js';
import { TaskForceMapper, TaskForceColonizeOrderMapper, TaskForceFollowOrderMapper, TaskForceMoveOrderMapper, TaskForceOrderMapper, TaskForceShipMapper, TaskForceShipCommisionMapper } from './taskForce/schema.mappers.js';
import { TaskForceEngagementMapper } from './taskForceEngagement/schema.mappers.js';
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

export type Discovery = ResourceDiscovery | UnknownDiscovery;

export type Game = {
  __typename?: 'Game';
  id: Scalars['ID']['output'];
  me?: Maybe<Player>;
  name: Scalars['String']['output'];
  players: Array<Player>;
  resources: Array<Resource>;
  shipComponents: Array<ShipComponent>;
  shipDesigns: Array<ShipDesign>;
  starSystems: Array<StarSystem>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  taskForceEngagements: Array<TaskForceEngagement>;
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
  orderTaskForce: TaskForce;
  registerWithPassword: User;
  startGame: Game;
};


export type MutationcreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationcreateShipDesignArgs = {
  design: ShipDesignInput;
  gameId: Scalars['ID']['input'];
};


export type MutationcreateTaskForceCommisionArgs = {
  commision: TaskForceCommisionInput;
};


export type MutationjoinGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationloginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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


export type MutationstartGameArgs = {
  id: Scalars['ID']['input'];
};

export type Player = {
  __typename?: 'Player';
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  resources: Array<Resource>;
  shipComponents: Array<ShipComponent>;
  shipDesigns: Array<ShipDesign>;
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
  game: Game;
  games: Array<Game>;
  me?: Maybe<User>;
  starSystem: StarSystem;
  taskForceEngagement: TaskForceEngagement;
  taskForceShipCommision: TaskForceShipCommision;
};


export type QuerygameArgs = {
  id: Scalars['ID']['input'];
};


export type QuerystarSystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerytaskForceEngagementArgs = {
  id: Scalars['ID']['input'];
};


export type QuerytaskForceShipCommisionArgs = {
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

export type ShipComponent = {
  __typename?: 'ShipComponent';
  armorEffectivenessAgainst?: Maybe<Array<ShipComponentEffectivenessAgainst>>;
  armorThickness?: Maybe<Scalars['Float']['output']>;
  constructionCost: Scalars['Float']['output'];
  costs: Array<ResourceCost>;
  crewCapacity?: Maybe<Scalars['Float']['output']>;
  crewNeed: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  ftlSpeed?: Maybe<Scalars['Float']['output']>;
  hullBoost?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  powerGeneration?: Maybe<Scalars['Float']['output']>;
  powerNeed: Scalars['Float']['output'];
  sensorPrecision?: Maybe<Scalars['Float']['output']>;
  sensorRange?: Maybe<Scalars['Float']['output']>;
  shieldEffectivenessAgainst?: Maybe<Array<ShipComponentEffectivenessAgainst>>;
  shieldStrength?: Maybe<Scalars['Float']['output']>;
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
  deliveryType: WeaponDeliveryType;
  effectiveness: Scalars['Float']['output'];
};

export type ShipDesign = {
  __typename?: 'ShipDesign';
  components: Array<ShipComponent>;
  costs: Array<ResourceCost>;
  decommissioned: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: Player;
  previousDesign?: Maybe<ShipDesign>;
};

export type ShipDesignInput = {
  componentIds: Array<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  previousDesignId?: InputMaybe<Scalars['ID']['input']>;
  resourceId: Scalars['ID']['input'];
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
  resourceDepots?: Maybe<Array<ResourceDepot>>;
  sensorRange?: Maybe<Scalars['Float']['output']>;
  taskForceShipCommisions: Array<TaskForceShipCommision>;
  taskForces: Array<TaskForce>;
};

export type StarSystemUpdateEvent = {
  __typename?: 'StarSystemUpdateEvent';
  subject: StarSystem;
};

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackStarSystem: TrackStarSystemEvent;
  trackTaskForceEngagement: TaskForceEngagementEvent;
};


export type SubscriptiontrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptiontrackStarSystemArgs = {
  starSystemId: Scalars['ID']['input'];
};


export type SubscriptiontrackTaskForceEngagementArgs = {
  taskForceEngagementId: Scalars['ID']['input'];
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

export type TaskForceColonizeOrder = TaskForceOrder & {
  __typename?: 'TaskForceColonizeOrder';
  id: Scalars['ID']['output'];
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

export type TaskForceCommisionUpdateEvent = {
  __typename?: 'TaskForceCommisionUpdateEvent';
  constructionPerTick: Scalars['Float']['output'];
  subject: TaskForceShipCommision;
};

export type TaskForceEngagement = {
  __typename?: 'TaskForceEngagement';
  id: Scalars['ID']['output'];
  phase: TaskForceEngagementPhase;
  phaseProgress: Scalars['Float']['output'];
  position: Scalars['Vector']['output'];
  taskForces: Array<TaskForce>;
};

export type TaskForceEngagementEvent = TaskForceEngagementProgressEvent | TaskForceEngagementWeaponFiredEvent;

export type TaskForceEngagementPhase =
  | 'engagement'
  | 'locating'
  | 'resolution';

export type TaskForceEngagementProgressEvent = {
  __typename?: 'TaskForceEngagementProgressEvent';
  engagement: TaskForceEngagement;
};

export type TaskForceEngagementWeaponFiredEvent = {
  __typename?: 'TaskForceEngagementWeaponFiredEvent';
  attacker: TaskForceShip;
  damage: Scalars['Float']['output'];
  engagement: TaskForceEngagement;
  target: TaskForceShip;
  weapon: TaskForceShipComponent;
};

export type TaskForceFollowOrder = TaskForceOrder & {
  __typename?: 'TaskForceFollowOrder';
  id: Scalars['ID']['output'];
  taskForce: TaskForce;
};

export type TaskForceFollowOrderInput = {
  taskForceId: Scalars['ID']['input'];
};

export type TaskForceJoinsEngagementEvent = {
  __typename?: 'TaskForceJoinsEngagementEvent';
  subject: TaskForceEngagement;
};

export type TaskForceLeavesEngagementEvent = {
  __typename?: 'TaskForceLeavesEngagementEvent';
  subject: TaskForceEngagement;
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

export type TaskForceShip = {
  __typename?: 'TaskForceShip';
  components: Array<TaskForceShipComponent>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: TaskForceShipRole;
  shipDesign: ShipDesign;
  structuralIntegrity: Scalars['Float']['output'];
  supplyCarried: Scalars['Float']['output'];
};

export type TaskForceShipCommision = {
  __typename?: 'TaskForceShipCommision';
  constructionDone: Scalars['Float']['output'];
  constructionPerTick?: Maybe<Scalars['Float']['output']>;
  constructionTotal: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  resourceNeeds: Array<ResourceNeed>;
  role: TaskForceShipRole;
  shipDesign: ShipDesign;
};

export type TaskForceShipComponent = {
  __typename?: 'TaskForceShipComponent';
  component: ShipComponent;
  id: Scalars['ID']['output'];
  state: Scalars['Float']['output'];
};

export type TaskForceShipRole =
  | 'capital'
  | 'screen'
  | 'support';

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent | StarSystemUpdateEvent | TaskForceJoinsEngagementEvent | TaskForceLeavesEngagementEvent;

export type TrackStarSystemEvent = StarSystemUpdateEvent | TaskForceCommisionUpdateEvent;

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
  TaskForceEngagementEvent: ( Omit<TaskForceEngagementProgressEvent, 'engagement'> & { engagement: _RefType['TaskForceEngagement'] } & { __typename: 'TaskForceEngagementProgressEvent' } ) | ( Omit<TaskForceEngagementWeaponFiredEvent, 'attacker' | 'engagement' | 'target' | 'weapon'> & { attacker: _RefType['TaskForceShip'], engagement: _RefType['TaskForceEngagement'], target: _RefType['TaskForceShip'], weapon: _RefType['TaskForceShipComponent'] } & { __typename: 'TaskForceEngagementWeaponFiredEvent' } );
  TrackGalaxyEvent: ( Omit<PositionableApppearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableApppearsEvent' } ) | ( Omit<PositionableDisappearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableDisappearsEvent' } ) | ( Omit<PositionableMovesEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableMovesEvent' } ) | ( Omit<StarSystemUpdateEvent, 'subject'> & { subject: _RefType['StarSystem'] } & { __typename: 'StarSystemUpdateEvent' } ) | ( Omit<TaskForceJoinsEngagementEvent, 'subject'> & { subject: _RefType['TaskForceEngagement'] } & { __typename: 'TaskForceJoinsEngagementEvent' } ) | ( Omit<TaskForceLeavesEngagementEvent, 'subject'> & { subject: _RefType['TaskForceEngagement'] } & { __typename: 'TaskForceLeavesEngagementEvent' } );
  TrackStarSystemEvent: ( Omit<StarSystemUpdateEvent, 'subject'> & { subject: _RefType['StarSystem'] } & { __typename: 'StarSystemUpdateEvent' } ) | ( Omit<TaskForceCommisionUpdateEvent, 'subject'> & { subject: _RefType['TaskForceShipCommision'] } & { __typename: 'TaskForceCommisionUpdateEvent' } );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Positionable: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } );
  TaskForceOrder: ( TaskForceColonizeOrderMapper & { __typename: 'TaskForceColonizeOrder' } ) | ( TaskForceFollowOrderMapper & { __typename: 'TaskForceFollowOrder' } ) | ( TaskForceMoveOrderMapper & { __typename: 'TaskForceMoveOrder' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Discovery: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Discovery']>;
  Game: ResolverTypeWrapper<GameMapper>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Player: ResolverTypeWrapper<PlayerMapper>;
  Population: ResolverTypeWrapper<PopulationMapper>;
  Positionable: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Positionable']>;
  PositionableApppearsEvent: ResolverTypeWrapper<Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableDisappearsEvent: ResolverTypeWrapper<Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableMovesEvent: ResolverTypeWrapper<Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  Query: ResolverTypeWrapper<{}>;
  Resource: ResolverTypeWrapper<ResourceMapper>;
  ResourceCost: ResolverTypeWrapper<ResourceCostMapper>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ResourceDepot: ResolverTypeWrapper<ResourceDepotMapper>;
  ResourceDiscovery: ResolverTypeWrapper<ResourceDiscoveryMapper>;
  ResourceNeed: ResolverTypeWrapper<ResourceNeedMapper>;
  ShipComponent: ResolverTypeWrapper<ShipComponentMapper>;
  ShipComponentEffectivenessAgainst: ResolverTypeWrapper<Omit<ShipComponentEffectivenessAgainst, 'deliveryType'> & { deliveryType: ResolversTypes['WeaponDeliveryType'] }>;
  ShipDesign: ResolverTypeWrapper<ShipDesignMapper>;
  ShipDesignInput: ShipDesignInput;
  StarSystem: ResolverTypeWrapper<StarSystemMapper>;
  StarSystemUpdateEvent: ResolverTypeWrapper<Omit<StarSystemUpdateEvent, 'subject'> & { subject: ResolversTypes['StarSystem'] }>;
  Subscription: ResolverTypeWrapper<{}>;
  TaskForce: ResolverTypeWrapper<TaskForceMapper>;
  TaskForceColonizeOrder: ResolverTypeWrapper<TaskForceColonizeOrderMapper>;
  TaskForceCommisionInput: TaskForceCommisionInput;
  TaskForceCommisionShipInput: TaskForceCommisionShipInput;
  TaskForceCommisionUpdateEvent: ResolverTypeWrapper<Omit<TaskForceCommisionUpdateEvent, 'subject'> & { subject: ResolversTypes['TaskForceShipCommision'] }>;
  TaskForceEngagement: ResolverTypeWrapper<TaskForceEngagementMapper>;
  TaskForceEngagementEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TaskForceEngagementEvent']>;
  TaskForceEngagementPhase: ResolverTypeWrapper<'locating' | 'engagement' | 'resolution'>;
  TaskForceEngagementProgressEvent: ResolverTypeWrapper<Omit<TaskForceEngagementProgressEvent, 'engagement'> & { engagement: ResolversTypes['TaskForceEngagement'] }>;
  TaskForceEngagementWeaponFiredEvent: ResolverTypeWrapper<Omit<TaskForceEngagementWeaponFiredEvent, 'attacker' | 'engagement' | 'target' | 'weapon'> & { attacker: ResolversTypes['TaskForceShip'], engagement: ResolversTypes['TaskForceEngagement'], target: ResolversTypes['TaskForceShip'], weapon: ResolversTypes['TaskForceShipComponent'] }>;
  TaskForceFollowOrder: ResolverTypeWrapper<TaskForceFollowOrderMapper>;
  TaskForceFollowOrderInput: TaskForceFollowOrderInput;
  TaskForceJoinsEngagementEvent: ResolverTypeWrapper<Omit<TaskForceJoinsEngagementEvent, 'subject'> & { subject: ResolversTypes['TaskForceEngagement'] }>;
  TaskForceLeavesEngagementEvent: ResolverTypeWrapper<Omit<TaskForceLeavesEngagementEvent, 'subject'> & { subject: ResolversTypes['TaskForceEngagement'] }>;
  TaskForceMoveOrder: ResolverTypeWrapper<TaskForceMoveOrderMapper>;
  TaskForceMoveOrderInput: TaskForceMoveOrderInput;
  TaskForceOrder: ResolverTypeWrapper<TaskForceOrderMapper>;
  TaskForceOrderInput: TaskForceOrderInput;
  TaskForceShip: ResolverTypeWrapper<TaskForceShipMapper>;
  TaskForceShipCommision: ResolverTypeWrapper<TaskForceShipCommisionMapper>;
  TaskForceShipComponent: ResolverTypeWrapper<Omit<TaskForceShipComponent, 'component'> & { component: ResolversTypes['ShipComponent'] }>;
  TaskForceShipRole: ResolverTypeWrapper<'capital' | 'screen' | 'support'>;
  TrackGalaxyEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackGalaxyEvent']>;
  TrackStarSystemEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackStarSystemEvent']>;
  UnknownDiscovery: ResolverTypeWrapper<UnknownDiscovery>;
  User: ResolverTypeWrapper<User>;
  Vector: ResolverTypeWrapper<Scalars['Vector']['output']>;
  WeaponDeliveryType: ResolverTypeWrapper<'projectile' | 'beam' | 'missile' | 'instant'>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  DateTime: Scalars['DateTime']['output'];
  Discovery: ResolversUnionTypes<ResolversParentTypes>['Discovery'];
  Game: GameMapper;
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Boolean: Scalars['Boolean']['output'];
  Player: PlayerMapper;
  Population: PopulationMapper;
  Positionable: ResolversInterfaceTypes<ResolversParentTypes>['Positionable'];
  PositionableApppearsEvent: Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableDisappearsEvent: Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableMovesEvent: Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  Query: {};
  Resource: ResourceMapper;
  ResourceCost: ResourceCostMapper;
  Float: Scalars['Float']['output'];
  ResourceDepot: ResourceDepotMapper;
  ResourceDiscovery: ResourceDiscoveryMapper;
  ResourceNeed: ResourceNeedMapper;
  ShipComponent: ShipComponentMapper;
  ShipComponentEffectivenessAgainst: ShipComponentEffectivenessAgainst;
  ShipDesign: ShipDesignMapper;
  ShipDesignInput: ShipDesignInput;
  StarSystem: StarSystemMapper;
  StarSystemUpdateEvent: Omit<StarSystemUpdateEvent, 'subject'> & { subject: ResolversParentTypes['StarSystem'] };
  Subscription: {};
  TaskForce: TaskForceMapper;
  TaskForceColonizeOrder: TaskForceColonizeOrderMapper;
  TaskForceCommisionInput: TaskForceCommisionInput;
  TaskForceCommisionShipInput: TaskForceCommisionShipInput;
  TaskForceCommisionUpdateEvent: Omit<TaskForceCommisionUpdateEvent, 'subject'> & { subject: ResolversParentTypes['TaskForceShipCommision'] };
  TaskForceEngagement: TaskForceEngagementMapper;
  TaskForceEngagementEvent: ResolversUnionTypes<ResolversParentTypes>['TaskForceEngagementEvent'];
  TaskForceEngagementProgressEvent: Omit<TaskForceEngagementProgressEvent, 'engagement'> & { engagement: ResolversParentTypes['TaskForceEngagement'] };
  TaskForceEngagementWeaponFiredEvent: Omit<TaskForceEngagementWeaponFiredEvent, 'attacker' | 'engagement' | 'target' | 'weapon'> & { attacker: ResolversParentTypes['TaskForceShip'], engagement: ResolversParentTypes['TaskForceEngagement'], target: ResolversParentTypes['TaskForceShip'], weapon: ResolversParentTypes['TaskForceShipComponent'] };
  TaskForceFollowOrder: TaskForceFollowOrderMapper;
  TaskForceFollowOrderInput: TaskForceFollowOrderInput;
  TaskForceJoinsEngagementEvent: Omit<TaskForceJoinsEngagementEvent, 'subject'> & { subject: ResolversParentTypes['TaskForceEngagement'] };
  TaskForceLeavesEngagementEvent: Omit<TaskForceLeavesEngagementEvent, 'subject'> & { subject: ResolversParentTypes['TaskForceEngagement'] };
  TaskForceMoveOrder: TaskForceMoveOrderMapper;
  TaskForceMoveOrderInput: TaskForceMoveOrderInput;
  TaskForceOrder: TaskForceOrderMapper;
  TaskForceOrderInput: TaskForceOrderInput;
  TaskForceShip: TaskForceShipMapper;
  TaskForceShipCommision: TaskForceShipCommisionMapper;
  TaskForceShipComponent: Omit<TaskForceShipComponent, 'component'> & { component: ResolversParentTypes['ShipComponent'] };
  TrackGalaxyEvent: ResolversUnionTypes<ResolversParentTypes>['TrackGalaxyEvent'];
  TrackStarSystemEvent: ResolversUnionTypes<ResolversParentTypes>['TrackStarSystemEvent'];
  UnknownDiscovery: UnknownDiscovery;
  User: User;
  Vector: Scalars['Vector']['output'];
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DiscoveryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Discovery'] = ResolversParentTypes['Discovery']> = {
  __resolveType?: TypeResolveFn<'ResourceDiscovery' | 'UnknownDiscovery', ParentType, ContextType>;
};

export type GameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  resources?: Resolver<Array<ResolversTypes['Resource']>, ParentType, ContextType>;
  shipComponents?: Resolver<Array<ResolversTypes['ShipComponent']>, ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  starSystems?: Resolver<Array<ResolversTypes['StarSystem']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  taskForceEngagements?: Resolver<Array<ResolversTypes['TaskForceEngagement']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  tickRate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationcreateGameArgs, 'name'>>;
  createShipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType, RequireFields<MutationcreateShipDesignArgs, 'design' | 'gameId'>>;
  createTaskForceCommision?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationcreateTaskForceCommisionArgs, 'commision'>>;
  joinGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationjoinGameArgs, 'id'>>;
  loginWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationloginWithPasswordArgs, 'email' | 'password'>>;
  loginWithRefreshToken?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  orderTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationorderTaskForceArgs, 'id' | 'orders'>>;
  registerWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationregisterWithPasswordArgs, 'email' | 'name' | 'password'>>;
  startGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationstartGameArgs, 'id'>>;
};

export type PlayerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resources?: Resolver<Array<ResolversTypes['Resource']>, ParentType, ContextType>;
  shipComponents?: Resolver<Array<ResolversTypes['ShipComponent']>, ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
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
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<QuerygameArgs, 'id'>>;
  games?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<QuerystarSystemArgs, 'id'>>;
  taskForceEngagement?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType, RequireFields<QuerytaskForceEngagementArgs, 'id'>>;
  taskForceShipCommision?: Resolver<ResolversTypes['TaskForceShipCommision'], ParentType, ContextType, RequireFields<QuerytaskForceShipCommisionArgs, 'id'>>;
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

export type ResourceDepotResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceDepot'] = ResolversParentTypes['ResourceDepot']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type ResourceNeedResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceNeed'] = ResolversParentTypes['ResourceNeed']> = {
  alotted?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  needed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipComponentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipComponent'] = ResolversParentTypes['ShipComponent']> = {
  armorEffectivenessAgainst?: Resolver<Maybe<Array<ResolversTypes['ShipComponentEffectivenessAgainst']>>, ParentType, ContextType>;
  armorThickness?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  constructionCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  costs?: Resolver<Array<ResolversTypes['ResourceCost']>, ParentType, ContextType>;
  crewCapacity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  crewNeed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ftlSpeed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  hullBoost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  powerGeneration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  powerNeed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sensorPrecision?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sensorRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  shieldEffectivenessAgainst?: Resolver<Maybe<Array<ResolversTypes['ShipComponentEffectivenessAgainst']>>, ParentType, ContextType>;
  shieldStrength?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
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
  deliveryType?: Resolver<ResolversTypes['WeaponDeliveryType'], ParentType, ContextType>;
  effectiveness?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipDesignResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipDesign'] = ResolversParentTypes['ShipDesign']> = {
  components?: Resolver<Array<ResolversTypes['ShipComponent']>, ParentType, ContextType>;
  costs?: Resolver<Array<ResolversTypes['ResourceCost']>, ParentType, ContextType>;
  decommissioned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  previousDesign?: Resolver<Maybe<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystem'] = ResolversParentTypes['StarSystem']> = {
  discoveries?: Resolver<Maybe<Array<ResolversTypes['Discovery']>>, ParentType, ContextType>;
  discoveryProgress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  populations?: Resolver<Maybe<Array<ResolversTypes['Population']>>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  resourceDepots?: Resolver<Maybe<Array<ResolversTypes['ResourceDepot']>>, ParentType, ContextType>;
  sensorRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  taskForceShipCommisions?: Resolver<Array<ResolversTypes['TaskForceShipCommision']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemUpdateEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystemUpdateEvent'] = ResolversParentTypes['StarSystemUpdateEvent']> = {
  subject?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  trackGalaxy?: SubscriptionResolver<ResolversTypes['TrackGalaxyEvent'], "trackGalaxy", ParentType, ContextType, RequireFields<SubscriptiontrackGalaxyArgs, 'gameId'>>;
  trackStarSystem?: SubscriptionResolver<ResolversTypes['TrackStarSystemEvent'], "trackStarSystem", ParentType, ContextType, RequireFields<SubscriptiontrackStarSystemArgs, 'starSystemId'>>;
  trackTaskForceEngagement?: SubscriptionResolver<ResolversTypes['TaskForceEngagementEvent'], "trackTaskForceEngagement", ParentType, ContextType, RequireFields<SubscriptiontrackTaskForceEngagementArgs, 'taskForceEngagementId'>>;
};

export type TaskForceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForce'] = ResolversParentTypes['TaskForce']> = {
  commisions?: Resolver<Array<ResolversTypes['TaskForceShipCommision']>, ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  movementVector?: Resolver<Maybe<ResolversTypes['Vector']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<ResolversTypes['TaskForceOrder']>>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  sensorRange?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ships?: Resolver<Array<ResolversTypes['TaskForceShip']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceColonizeOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceColonizeOrder'] = ResolversParentTypes['TaskForceColonizeOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceCommisionUpdateEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceCommisionUpdateEvent'] = ResolversParentTypes['TaskForceCommisionUpdateEvent']> = {
  constructionPerTick?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['TaskForceShipCommision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagement'] = ResolversParentTypes['TaskForceEngagement']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['TaskForceEngagementPhase'], ParentType, ContextType>;
  phaseProgress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagementEvent'] = ResolversParentTypes['TaskForceEngagementEvent']> = {
  __resolveType?: TypeResolveFn<'TaskForceEngagementProgressEvent' | 'TaskForceEngagementWeaponFiredEvent', ParentType, ContextType>;
};

export type TaskForceEngagementPhaseResolvers = EnumResolverSignature<{ engagement?: any, locating?: any, resolution?: any }, ResolversTypes['TaskForceEngagementPhase']>;

export type TaskForceEngagementProgressEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagementProgressEvent'] = ResolversParentTypes['TaskForceEngagementProgressEvent']> = {
  engagement?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementWeaponFiredEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagementWeaponFiredEvent'] = ResolversParentTypes['TaskForceEngagementWeaponFiredEvent']> = {
  attacker?: Resolver<ResolversTypes['TaskForceShip'], ParentType, ContextType>;
  damage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  engagement?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['TaskForceShip'], ParentType, ContextType>;
  weapon?: Resolver<ResolversTypes['TaskForceShipComponent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceFollowOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceFollowOrder'] = ResolversParentTypes['TaskForceFollowOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceJoinsEngagementEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceJoinsEngagementEvent'] = ResolversParentTypes['TaskForceJoinsEngagementEvent']> = {
  subject?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceLeavesEngagementEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceLeavesEngagementEvent'] = ResolversParentTypes['TaskForceLeavesEngagementEvent']> = {
  subject?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType>;
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

export type TaskForceShipResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShip'] = ResolversParentTypes['TaskForceShip']> = {
  components?: Resolver<Array<ResolversTypes['TaskForceShipComponent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['TaskForceShipRole'], ParentType, ContextType>;
  shipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType>;
  structuralIntegrity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  supplyCarried?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipCommisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShipCommision'] = ResolversParentTypes['TaskForceShipCommision']> = {
  constructionDone?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  constructionPerTick?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  constructionTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourceNeeds?: Resolver<Array<ResolversTypes['ResourceNeed']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['TaskForceShipRole'], ParentType, ContextType>;
  shipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipComponentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShipComponent'] = ResolversParentTypes['TaskForceShipComponent']> = {
  component?: Resolver<ResolversTypes['ShipComponent'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipRoleResolvers = EnumResolverSignature<{ capital?: any, screen?: any, support?: any }, ResolversTypes['TaskForceShipRole']>;

export type TrackGalaxyEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackGalaxyEvent'] = ResolversParentTypes['TrackGalaxyEvent']> = {
  __resolveType?: TypeResolveFn<'PositionableApppearsEvent' | 'PositionableDisappearsEvent' | 'PositionableMovesEvent' | 'StarSystemUpdateEvent' | 'TaskForceJoinsEngagementEvent' | 'TaskForceLeavesEngagementEvent', ParentType, ContextType>;
};

export type TrackStarSystemEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackStarSystemEvent'] = ResolversParentTypes['TrackStarSystemEvent']> = {
  __resolveType?: TypeResolveFn<'StarSystemUpdateEvent' | 'TaskForceCommisionUpdateEvent', ParentType, ContextType>;
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
  Discovery?: DiscoveryResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Population?: PopulationResolvers<ContextType>;
  Positionable?: PositionableResolvers<ContextType>;
  PositionableApppearsEvent?: PositionableApppearsEventResolvers<ContextType>;
  PositionableDisappearsEvent?: PositionableDisappearsEventResolvers<ContextType>;
  PositionableMovesEvent?: PositionableMovesEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  ResourceCost?: ResourceCostResolvers<ContextType>;
  ResourceDepot?: ResourceDepotResolvers<ContextType>;
  ResourceDiscovery?: ResourceDiscoveryResolvers<ContextType>;
  ResourceNeed?: ResourceNeedResolvers<ContextType>;
  ShipComponent?: ShipComponentResolvers<ContextType>;
  ShipComponentEffectivenessAgainst?: ShipComponentEffectivenessAgainstResolvers<ContextType>;
  ShipDesign?: ShipDesignResolvers<ContextType>;
  StarSystem?: StarSystemResolvers<ContextType>;
  StarSystemUpdateEvent?: StarSystemUpdateEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskForce?: TaskForceResolvers<ContextType>;
  TaskForceColonizeOrder?: TaskForceColonizeOrderResolvers<ContextType>;
  TaskForceCommisionUpdateEvent?: TaskForceCommisionUpdateEventResolvers<ContextType>;
  TaskForceEngagement?: TaskForceEngagementResolvers<ContextType>;
  TaskForceEngagementEvent?: TaskForceEngagementEventResolvers<ContextType>;
  TaskForceEngagementPhase?: TaskForceEngagementPhaseResolvers;
  TaskForceEngagementProgressEvent?: TaskForceEngagementProgressEventResolvers<ContextType>;
  TaskForceEngagementWeaponFiredEvent?: TaskForceEngagementWeaponFiredEventResolvers<ContextType>;
  TaskForceFollowOrder?: TaskForceFollowOrderResolvers<ContextType>;
  TaskForceJoinsEngagementEvent?: TaskForceJoinsEngagementEventResolvers<ContextType>;
  TaskForceLeavesEngagementEvent?: TaskForceLeavesEngagementEventResolvers<ContextType>;
  TaskForceMoveOrder?: TaskForceMoveOrderResolvers<ContextType>;
  TaskForceOrder?: TaskForceOrderResolvers<ContextType>;
  TaskForceShip?: TaskForceShipResolvers<ContextType>;
  TaskForceShipCommision?: TaskForceShipCommisionResolvers<ContextType>;
  TaskForceShipComponent?: TaskForceShipComponentResolvers<ContextType>;
  TaskForceShipRole?: TaskForceShipRoleResolvers;
  TrackGalaxyEvent?: TrackGalaxyEventResolvers<ContextType>;
  TrackStarSystemEvent?: TrackStarSystemEventResolvers<ContextType>;
  UnknownDiscovery?: UnknownDiscoveryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vector?: GraphQLScalarType;
  WeaponDeliveryType?: WeaponDeliveryTypeResolvers;
};

