import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GameMapper, PlayerMapper } from './game/schema.mappers.js';
import { ResourceCostMapper, ShipDesignMapper } from './shipDesign/schema.mappers.js';
import { ResourceDepotMapper, ResourceDiscoveryMapper, StarSystemMapper } from './starSystem/schema.mappers.js';
import { ResourceNeedMapper } from './resource/schema.mappers.js';
import { TaskForceMapper, TaskForceMoveOrderMapper, TaskForceOrderMapper, TaskForceShipMapper, TaskForceShipCommisionMapper } from './taskForce/schema.mappers.js';
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
  DateTime: { input: Date | string; output: Date | string; }
  Vector: { input: {x:number;y:number}; output: {x:number;y:number}; }
};

export type Discovery = ResourceDiscovery;

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


export type MutationmoveTaskForceArgs = {
  id: Scalars['ID']['input'];
  position: Scalars['Vector']['input'];
};


export type MutationqueueTaskForceMoveArgs = {
  id: Scalars['ID']['input'];
  position: Scalars['Vector']['input'];
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


export type QuerygameArgs = {
  id: Scalars['ID']['input'];
};


export type QuerystarSystemArgs = {
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
  remainingDeposits: Scalars['Float']['output'];
  resource: Resource;
};

export type ResourceNeed = {
  __typename?: 'ResourceNeed';
  alotted: Scalars['Float']['output'];
  needed: Scalars['Float']['output'];
  resource: Resource;
};

export type SensorRange = {
  id: Scalars['ID']['output'];
  sensorRange: Scalars['Float']['output'];
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

export type StarSystem = Positionable & SensorRange & {
  __typename?: 'StarSystem';
  discoveries: Array<Discovery>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Player>;
  position: Scalars['Vector']['output'];
  resourceDepots: Array<ResourceDepot>;
  sensorRange: Scalars['Float']['output'];
  taskForceShipCommisions: Array<TaskForceShipCommision>;
  taskForces: Array<TaskForce>;
};

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackStarSystem: TrackStarSystemEvent;
};


export type SubscriptiontrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptiontrackStarSystemArgs = {
  starSystemId: Scalars['ID']['input'];
};

export type TaskForce = Positionable & SensorRange & {
  __typename?: 'TaskForce';
  commisions: Array<TaskForceShipCommision>;
  game: Game;
  id: Scalars['ID']['output'];
  movementVector?: Maybe<Scalars['Vector']['output']>;
  name: Scalars['String']['output'];
  orders: Array<TaskForceOrder>;
  owner: Player;
  position: Scalars['Vector']['output'];
  sensorRange: Scalars['Float']['output'];
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
  progress: Scalars['Float']['output'];
  resourceNeeds: Array<ResourceNeed>;
  role: TaskForceShipRole;
  shipDesign: ShipDesign;
};

export type TaskForceShipCommisionProgressEvent = {
  __typename?: 'TaskForceShipCommisionProgressEvent';
  subject: TaskForceShipCommision;
};

export type TaskForceShipRole =
  | 'capital'
  | 'carrier'
  | 'scout'
  | 'screen'
  | 'support'
  | 'transport';

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent;

export type TrackStarSystemEvent = TaskForceShipCommisionProgressEvent;

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};



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
  Discovery: ( ResourceDiscoveryMapper & { __typename: 'ResourceDiscovery' } );
  TrackGalaxyEvent: ( Omit<PositionableApppearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableApppearsEvent' } ) | ( Omit<PositionableDisappearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableDisappearsEvent' } ) | ( Omit<PositionableMovesEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableMovesEvent' } );
  TrackStarSystemEvent: ( Omit<TaskForceShipCommisionProgressEvent, 'subject'> & { subject: _RefType['TaskForceShipCommision'] } & { __typename: 'TaskForceShipCommisionProgressEvent' } );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Positionable: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } );
  SensorRange: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } );
  TaskForceOrder: ( TaskForceMoveOrderMapper & { __typename: 'TaskForceMoveOrder' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Discovery: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Discovery']>;
  Game: ResolverTypeWrapper<GameMapper>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<PlayerMapper>;
  Positionable: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Positionable']>;
  PositionableApppearsEvent: ResolverTypeWrapper<Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableDisappearsEvent: ResolverTypeWrapper<Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  PositionableMovesEvent: ResolverTypeWrapper<Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversTypes['Positionable'] }>;
  Query: ResolverTypeWrapper<{}>;
  Resource: ResolverTypeWrapper<Resource>;
  ResourceCost: ResolverTypeWrapper<ResourceCostMapper>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ResourceDepot: ResolverTypeWrapper<ResourceDepotMapper>;
  ResourceDiscovery: ResolverTypeWrapper<ResourceDiscoveryMapper>;
  ResourceNeed: ResolverTypeWrapper<ResourceNeedMapper>;
  SensorRange: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['SensorRange']>;
  ShipDesign: ResolverTypeWrapper<ShipDesignMapper>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ShipDesignInput: ShipDesignInput;
  StarSystem: ResolverTypeWrapper<StarSystemMapper>;
  Subscription: ResolverTypeWrapper<{}>;
  TaskForce: ResolverTypeWrapper<TaskForceMapper>;
  TaskForceCommisionInput: TaskForceCommisionInput;
  TaskForceCommisionShipInput: TaskForceCommisionShipInput;
  TaskForceMoveOrder: ResolverTypeWrapper<TaskForceMoveOrderMapper>;
  TaskForceOrder: ResolverTypeWrapper<TaskForceOrderMapper>;
  TaskForceShip: ResolverTypeWrapper<TaskForceShipMapper>;
  TaskForceShipCommision: ResolverTypeWrapper<TaskForceShipCommisionMapper>;
  TaskForceShipCommisionProgressEvent: ResolverTypeWrapper<Omit<TaskForceShipCommisionProgressEvent, 'subject'> & { subject: ResolversTypes['TaskForceShipCommision'] }>;
  TaskForceShipRole: ResolverTypeWrapper<'capital' | 'screen' | 'carrier' | 'scout' | 'support' | 'transport'>;
  TrackGalaxyEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackGalaxyEvent']>;
  TrackStarSystemEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackStarSystemEvent']>;
  User: ResolverTypeWrapper<User>;
  Vector: ResolverTypeWrapper<Scalars['Vector']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime']['output'];
  Discovery: ResolversUnionTypes<ResolversParentTypes>['Discovery'];
  Game: GameMapper;
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  Mutation: {};
  Player: PlayerMapper;
  Positionable: ResolversInterfaceTypes<ResolversParentTypes>['Positionable'];
  PositionableApppearsEvent: Omit<PositionableApppearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableDisappearsEvent: Omit<PositionableDisappearsEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  PositionableMovesEvent: Omit<PositionableMovesEvent, 'subject'> & { subject: ResolversParentTypes['Positionable'] };
  Query: {};
  Resource: Resource;
  ResourceCost: ResourceCostMapper;
  Float: Scalars['Float']['output'];
  ResourceDepot: ResourceDepotMapper;
  ResourceDiscovery: ResourceDiscoveryMapper;
  ResourceNeed: ResourceNeedMapper;
  SensorRange: ResolversInterfaceTypes<ResolversParentTypes>['SensorRange'];
  ShipDesign: ShipDesignMapper;
  Boolean: Scalars['Boolean']['output'];
  ShipDesignInput: ShipDesignInput;
  StarSystem: StarSystemMapper;
  Subscription: {};
  TaskForce: TaskForceMapper;
  TaskForceCommisionInput: TaskForceCommisionInput;
  TaskForceCommisionShipInput: TaskForceCommisionShipInput;
  TaskForceMoveOrder: TaskForceMoveOrderMapper;
  TaskForceOrder: TaskForceOrderMapper;
  TaskForceShip: TaskForceShipMapper;
  TaskForceShipCommision: TaskForceShipCommisionMapper;
  TaskForceShipCommisionProgressEvent: Omit<TaskForceShipCommisionProgressEvent, 'subject'> & { subject: ResolversParentTypes['TaskForceShipCommision'] };
  TrackGalaxyEvent: ResolversUnionTypes<ResolversParentTypes>['TrackGalaxyEvent'];
  TrackStarSystemEvent: ResolversUnionTypes<ResolversParentTypes>['TrackStarSystemEvent'];
  User: User;
  Vector: Scalars['Vector']['output'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DiscoveryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Discovery'] = ResolversParentTypes['Discovery']> = {
  __resolveType?: TypeResolveFn<'ResourceDiscovery', ParentType, ContextType>;
};

export type GameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  starSystems?: Resolver<Array<ResolversTypes['StarSystem']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationcreateGameArgs, 'name'>>;
  createShipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType, RequireFields<MutationcreateShipDesignArgs, 'design' | 'gameId'>>;
  createTaskForceCommision?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationcreateTaskForceCommisionArgs, 'commision'>>;
  joinGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationjoinGameArgs, 'id'>>;
  loginWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationloginWithPasswordArgs, 'email' | 'password'>>;
  loginWithRefreshToken?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  moveTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationmoveTaskForceArgs, 'id' | 'position'>>;
  queueTaskForceMove?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationqueueTaskForceMoveArgs, 'id' | 'position'>>;
  registerWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationregisterWithPasswordArgs, 'email' | 'name' | 'password'>>;
  startGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationstartGameArgs, 'id'>>;
};

export type PlayerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shipDesigns?: Resolver<Array<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
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

export type SensorRangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SensorRange'] = ResolversParentTypes['SensorRange']> = {
  __resolveType?: TypeResolveFn<'StarSystem' | 'TaskForce', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sensorRange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type ShipDesignResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipDesign'] = ResolversParentTypes['ShipDesign']> = {
  armorRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  costs?: Resolver<Array<ResolversTypes['ResourceCost']>, ParentType, ContextType>;
  decommissioned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hullRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  previousDesign?: Resolver<Maybe<ResolversTypes['ShipDesign']>, ParentType, ContextType>;
  shieldRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  speedRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  supplyCapacity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  supplyNeed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  weaponRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  zoneOfControlRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StarSystemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystem'] = ResolversParentTypes['StarSystem']> = {
  discoveries?: Resolver<Array<ResolversTypes['Discovery']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  resourceDepots?: Resolver<Array<ResolversTypes['ResourceDepot']>, ParentType, ContextType>;
  sensorRange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taskForceShipCommisions?: Resolver<Array<ResolversTypes['TaskForceShipCommision']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  trackGalaxy?: SubscriptionResolver<ResolversTypes['TrackGalaxyEvent'], "trackGalaxy", ParentType, ContextType, RequireFields<SubscriptiontrackGalaxyArgs, 'gameId'>>;
  trackStarSystem?: SubscriptionResolver<ResolversTypes['TrackStarSystemEvent'], "trackStarSystem", ParentType, ContextType, RequireFields<SubscriptiontrackStarSystemArgs, 'starSystemId'>>;
};

export type TaskForceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForce'] = ResolversParentTypes['TaskForce']> = {
  commisions?: Resolver<Array<ResolversTypes['TaskForceShipCommision']>, ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  movementVector?: Resolver<Maybe<ResolversTypes['Vector']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['TaskForceOrder']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  sensorRange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ships?: Resolver<Array<ResolversTypes['TaskForceShip']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceMoveOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceMoveOrder'] = ResolversParentTypes['TaskForceMoveOrder']> = {
  destination?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceOrder'] = ResolversParentTypes['TaskForceOrder']> = {
  __resolveType?: TypeResolveFn<'TaskForceMoveOrder', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type TaskForceShipResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShip'] = ResolversParentTypes['TaskForceShip']> = {
  armorState?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  hullState?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['TaskForceShipRole'], ParentType, ContextType>;
  shieldState?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType>;
  supplyCarried?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  weaponState?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipCommisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShipCommision'] = ResolversParentTypes['TaskForceShipCommision']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resourceNeeds?: Resolver<Array<ResolversTypes['ResourceNeed']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['TaskForceShipRole'], ParentType, ContextType>;
  shipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipCommisionProgressEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceShipCommisionProgressEvent'] = ResolversParentTypes['TaskForceShipCommisionProgressEvent']> = {
  subject?: Resolver<ResolversTypes['TaskForceShipCommision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceShipRoleResolvers = EnumResolverSignature<{ capital?: any, carrier?: any, scout?: any, screen?: any, support?: any, transport?: any }, ResolversTypes['TaskForceShipRole']>;

export type TrackGalaxyEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackGalaxyEvent'] = ResolversParentTypes['TrackGalaxyEvent']> = {
  __resolveType?: TypeResolveFn<'PositionableApppearsEvent' | 'PositionableDisappearsEvent' | 'PositionableMovesEvent', ParentType, ContextType>;
};

export type TrackStarSystemEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackStarSystemEvent'] = ResolversParentTypes['TrackStarSystemEvent']> = {
  __resolveType?: TypeResolveFn<'TaskForceShipCommisionProgressEvent', ParentType, ContextType>;
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

export type Resolvers<ContextType = Context> = {
  DateTime?: GraphQLScalarType;
  Discovery?: DiscoveryResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
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
  SensorRange?: SensorRangeResolvers<ContextType>;
  ShipDesign?: ShipDesignResolvers<ContextType>;
  StarSystem?: StarSystemResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskForce?: TaskForceResolvers<ContextType>;
  TaskForceMoveOrder?: TaskForceMoveOrderResolvers<ContextType>;
  TaskForceOrder?: TaskForceOrderResolvers<ContextType>;
  TaskForceShip?: TaskForceShipResolvers<ContextType>;
  TaskForceShipCommision?: TaskForceShipCommisionResolvers<ContextType>;
  TaskForceShipCommisionProgressEvent?: TaskForceShipCommisionProgressEventResolvers<ContextType>;
  TaskForceShipRole?: TaskForceShipRoleResolvers;
  TrackGalaxyEvent?: TrackGalaxyEventResolvers<ContextType>;
  TrackStarSystemEvent?: TrackStarSystemEventResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vector?: GraphQLScalarType;
};

