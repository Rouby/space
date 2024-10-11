import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GameMapper, PlayerMapper } from './game/schema.mappers.js';
import { StarSystemMapper } from './starSystem/schema.mappers.js';
import { TaskForceMapper, TaskForceCommisionFinishedMapper, TaskForceOrderMapper } from './taskForce/schema.mappers.js';
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
  queueTaskForceMove: TaskForce;
  registerWithPassword: User;
  startGame: Game;
};


export type MutationcreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationcreateTaskForceCommisionArgs = {
  starSystemId: Scalars['ID']['input'];
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
  taskForceCommision: TaskForceCommision;
};


export type QuerygameArgs = {
  id: Scalars['ID']['input'];
};


export type QuerystarSystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerytaskForceCommisionArgs = {
  id: Scalars['ID']['input'];
};

export type StarSystem = Positionable & {
  __typename?: 'StarSystem';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Player>;
  position: Scalars['Vector']['output'];
  taskForceCommisions: Array<TaskForceCommision>;
  taskForces: Array<TaskForce>;
};

export type Subscription = {
  __typename?: 'Subscription';
  taskForceCommisionFinished: TaskForceCommisionFinished;
  taskForceCommisionProgress: TaskForceCommision;
  trackGalaxy: TrackGalaxyEvent;
  trackStarSystem: TrackStarSystemEvent;
};


export type SubscriptiontaskForceCommisionFinishedArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptiontaskForceCommisionProgressArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptiontrackGalaxyArgs = {
  gameId: Scalars['ID']['input'];
};


export type SubscriptiontrackStarSystemArgs = {
  starSystemId: Scalars['ID']['input'];
};

export type TaskForce = Positionable & {
  __typename?: 'TaskForce';
  game: Game;
  id: Scalars['ID']['output'];
  movementVector?: Maybe<Scalars['Vector']['output']>;
  name: Scalars['String']['output'];
  orders: Array<TaskForceOrder>;
  owner: Player;
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

export type TaskForceCommisionProgressEvent = {
  __typename?: 'TaskForceCommisionProgressEvent';
  subject: TaskForceCommision;
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

export type TaskForceOrderType =
  | 'move';

export type TrackGalaxyEvent = PositionableApppearsEvent | PositionableDisappearsEvent | PositionableMovesEvent;

export type TrackStarSystemEvent = TaskForceCommisionProgressEvent;

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
  TrackGalaxyEvent: ( Omit<PositionableApppearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableApppearsEvent' } ) | ( Omit<PositionableDisappearsEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableDisappearsEvent' } ) | ( Omit<PositionableMovesEvent, 'subject'> & { subject: _RefType['Positionable'] } & { __typename: 'PositionableMovesEvent' } );
  TrackStarSystemEvent: ( TaskForceCommisionProgressEvent & { __typename: 'TaskForceCommisionProgressEvent' } );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Positionable: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } );
  TaskForceOrder: ( Omit<TaskForceMoveOrder, 'type'> & { type: _RefType['TaskForceOrderType'] } & { __typename: 'TaskForceMoveOrder' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
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
  StarSystem: ResolverTypeWrapper<StarSystemMapper>;
  Subscription: ResolverTypeWrapper<{}>;
  TaskForce: ResolverTypeWrapper<TaskForceMapper>;
  TaskForceCommision: ResolverTypeWrapper<TaskForceCommision>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  TaskForceCommisionFinished: ResolverTypeWrapper<TaskForceCommisionFinishedMapper>;
  TaskForceCommisionProgressEvent: ResolverTypeWrapper<TaskForceCommisionProgressEvent>;
  TaskForceMoveOrder: ResolverTypeWrapper<Omit<TaskForceMoveOrder, 'type'> & { type: ResolversTypes['TaskForceOrderType'] }>;
  TaskForceOrder: ResolverTypeWrapper<TaskForceOrderMapper>;
  TaskForceOrderType: ResolverTypeWrapper<'move'>;
  TrackGalaxyEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackGalaxyEvent']>;
  TrackStarSystemEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TrackStarSystemEvent']>;
  User: ResolverTypeWrapper<User>;
  Vector: ResolverTypeWrapper<Scalars['Vector']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime']['output'];
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
  StarSystem: StarSystemMapper;
  Subscription: {};
  TaskForce: TaskForceMapper;
  TaskForceCommision: TaskForceCommision;
  Float: Scalars['Float']['output'];
  TaskForceCommisionFinished: TaskForceCommisionFinishedMapper;
  TaskForceCommisionProgressEvent: TaskForceCommisionProgressEvent;
  TaskForceMoveOrder: TaskForceMoveOrder;
  TaskForceOrder: TaskForceOrderMapper;
  TrackGalaxyEvent: ResolversUnionTypes<ResolversParentTypes>['TrackGalaxyEvent'];
  TrackStarSystemEvent: ResolversUnionTypes<ResolversParentTypes>['TrackStarSystemEvent'];
  User: User;
  Vector: Scalars['Vector']['output'];
  Boolean: Scalars['Boolean']['output'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  starSystems?: Resolver<Array<ResolversTypes['StarSystem']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationcreateGameArgs, 'name'>>;
  createTaskForceCommision?: Resolver<ResolversTypes['TaskForceCommision'], ParentType, ContextType, RequireFields<MutationcreateTaskForceCommisionArgs, 'starSystemId'>>;
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
  taskForceCommision?: Resolver<ResolversTypes['TaskForceCommision'], ParentType, ContextType, RequireFields<QuerytaskForceCommisionArgs, 'id'>>;
};

export type StarSystemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StarSystem'] = ResolversParentTypes['StarSystem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  taskForceCommisions?: Resolver<Array<ResolversTypes['TaskForceCommision']>, ParentType, ContextType>;
  taskForces?: Resolver<Array<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  taskForceCommisionFinished?: SubscriptionResolver<ResolversTypes['TaskForceCommisionFinished'], "taskForceCommisionFinished", ParentType, ContextType, RequireFields<SubscriptiontaskForceCommisionFinishedArgs, 'id'>>;
  taskForceCommisionProgress?: SubscriptionResolver<ResolversTypes['TaskForceCommision'], "taskForceCommisionProgress", ParentType, ContextType, RequireFields<SubscriptiontaskForceCommisionProgressArgs, 'id'>>;
  trackGalaxy?: SubscriptionResolver<ResolversTypes['TrackGalaxyEvent'], "trackGalaxy", ParentType, ContextType, RequireFields<SubscriptiontrackGalaxyArgs, 'gameId'>>;
  trackStarSystem?: SubscriptionResolver<ResolversTypes['TrackStarSystemEvent'], "trackStarSystem", ParentType, ContextType, RequireFields<SubscriptiontrackStarSystemArgs, 'starSystemId'>>;
};

export type TaskForceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForce'] = ResolversParentTypes['TaskForce']> = {
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  movementVector?: Resolver<Maybe<ResolversTypes['Vector']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['TaskForceOrder']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceCommisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceCommision'] = ResolversParentTypes['TaskForceCommision']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceCommisionFinishedResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceCommisionFinished'] = ResolversParentTypes['TaskForceCommisionFinished']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskForce?: Resolver<Maybe<ResolversTypes['TaskForce']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceCommisionProgressEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceCommisionProgressEvent'] = ResolversParentTypes['TaskForceCommisionProgressEvent']> = {
  subject?: Resolver<ResolversTypes['TaskForceCommision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceMoveOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceMoveOrder'] = ResolversParentTypes['TaskForceMoveOrder']> = {
  destination?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaskForceOrderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceOrder'] = ResolversParentTypes['TaskForceOrder']> = {
  __resolveType?: TypeResolveFn<'TaskForceMoveOrder', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaskForceOrderType'], ParentType, ContextType>;
};

export type TaskForceOrderTypeResolvers = EnumResolverSignature<{ move?: any }, ResolversTypes['TaskForceOrderType']>;

export type TrackGalaxyEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackGalaxyEvent'] = ResolversParentTypes['TrackGalaxyEvent']> = {
  __resolveType?: TypeResolveFn<'PositionableApppearsEvent' | 'PositionableDisappearsEvent' | 'PositionableMovesEvent', ParentType, ContextType>;
};

export type TrackStarSystemEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrackStarSystemEvent'] = ResolversParentTypes['TrackStarSystemEvent']> = {
  __resolveType?: TypeResolveFn<'TaskForceCommisionProgressEvent', ParentType, ContextType>;
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
  Game?: GameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Positionable?: PositionableResolvers<ContextType>;
  PositionableApppearsEvent?: PositionableApppearsEventResolvers<ContextType>;
  PositionableDisappearsEvent?: PositionableDisappearsEventResolvers<ContextType>;
  PositionableMovesEvent?: PositionableMovesEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StarSystem?: StarSystemResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskForce?: TaskForceResolvers<ContextType>;
  TaskForceCommision?: TaskForceCommisionResolvers<ContextType>;
  TaskForceCommisionFinished?: TaskForceCommisionFinishedResolvers<ContextType>;
  TaskForceCommisionProgressEvent?: TaskForceCommisionProgressEventResolvers<ContextType>;
  TaskForceMoveOrder?: TaskForceMoveOrderResolvers<ContextType>;
  TaskForceOrder?: TaskForceOrderResolvers<ContextType>;
  TaskForceOrderType?: TaskForceOrderTypeResolvers;
  TrackGalaxyEvent?: TrackGalaxyEventResolvers<ContextType>;
  TrackStarSystemEvent?: TrackStarSystemEventResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vector?: GraphQLScalarType;
};

