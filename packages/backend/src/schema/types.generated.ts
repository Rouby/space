import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DilemmaMapper } from './dilemma/schema.mappers.js';
import { GameMapper, PlayerMapper, TurnReportMapper, TurnReportIndustrialProjectCompletionMapper, TurnReportIndustryChangeMapper, TurnReportMiningChangeMapper, TurnReportPopulationChangeMapper, TurnReportTaskForceConstructionChangeMapper } from './game/schema.mappers.js';
import { PopulationMapper, ResourceDiscoveryMapper, StarSystemMapper, StarSystemColonizationMapper } from './starSystem/schema.mappers.js';
import { ResourceMapper, ResourceCostMapper } from './resource/schema.mappers.js';
import { ShipComponentMapper } from './shipComponent/schema.mappers.js';
import { ShipDesignMapper } from './shipDesign/schema.mappers.js';
import { TaskForceMapper, TaskForceColonizeOrderMapper, TaskForceEngagementMapper, TaskForceEngagementParticipantStateMapper, TaskForceEngagementRoundLogEntryMapper, TaskForceFollowOrderMapper, TaskForceMoveOrderMapper, TaskForceOrderMapper } from './taskForce/schema.mappers.js';
import { Context } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type ConfigureTaskForceCombatDeckInput = {
  cardIds: Array<Scalars['String']['input']>;
  taskForceId: Scalars['ID']['input'];
};

export type ConstructTaskForceInput = {
  name: Scalars['String']['input'];
  shipDesignId: Scalars['ID']['input'];
  starSystemId: Scalars['ID']['input'];
};

export type DevelopmentStance =
  | 'balance'
  | 'grow_population'
  | 'industrialize';

export type DevelopmentStanceProjection = {
  __typename?: 'DevelopmentStanceProjection';
  industryDelta: Scalars['Int']['output'];
  populationDelta: Scalars['BigInt']['output'];
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
  activeTaskForceEngagements: Array<TaskForceEngagement>;
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

export type IndustrialProject = {
  __typename?: 'IndustrialProject';
  completedAtTurn?: Maybe<Scalars['Int']['output']>;
  completionIndustryBonus: Scalars['Int']['output'];
  etaTurns: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  industryPerTurn: Scalars['Int']['output'];
  projectType: IndustrialProjectType;
  queuePosition: Scalars['Int']['output'];
  queuedAtTurn: Scalars['Int']['output'];
  startedAtTurn?: Maybe<Scalars['Int']['output']>;
  turnsRemaining: Scalars['Int']['output'];
  workDone: Scalars['Int']['output'];
  workRequired: Scalars['Int']['output'];
};

export type IndustrialProjectType =
  | 'automation_hub'
  | 'factory_expansion'
  | 'orbital_foundry';

export type Mutation = {
  __typename?: 'Mutation';
  configureTaskForceCombatDeck: TaskForce;
  constructTaskForce: TaskForce;
  createGame: Game;
  createShipDesign: ShipDesign;
  endTurn: Game;
  joinGame: Game;
  loginWithPassword: User;
  loginWithRefreshToken: User;
  makeDilemmaChoice: Dilemma;
  orderTaskForce: TaskForce;
  queueIndustrialProject: StarSystem;
  registerWithPassword: User;
  setDevelopmentStance: StarSystem;
  startColonization: StarSystem;
  startGame: Game;
  submitTaskForceEngagementAction: TaskForceEngagement;
  updateGameSettings: Game;
  updatePlayer: Player;
};


export type MutationconfigureTaskForceCombatDeckArgs = {
  input: ConfigureTaskForceCombatDeckInput;
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


export type MutationqueueIndustrialProjectArgs = {
  projectType: IndustrialProjectType;
  starSystemId: Scalars['ID']['input'];
};


export type MutationregisterWithPasswordArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationsetDevelopmentStanceArgs = {
  stance: DevelopmentStance;
  starSystemId: Scalars['ID']['input'];
};


export type MutationstartColonizationArgs = {
  starSystemId: Scalars['ID']['input'];
};


export type MutationstartGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsubmitTaskForceEngagementActionArgs = {
  input: SubmitTaskForceEngagementActionInput;
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
  taskForceEngagement?: Maybe<TaskForceEngagement>;
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


export type QuerytaskForceEngagementArgs = {
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
  completedIndustrialProjects: Array<IndustrialProject>;
  currentDevelopmentStance?: Maybe<DevelopmentStance>;
  discoveries?: Maybe<Array<Discovery>>;
  discoveryProgress?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  industrialProjects: Array<IndustrialProject>;
  industry?: Maybe<Scalars['Int']['output']>;
  isVisible: Scalars['Boolean']['output'];
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  nextTurnStanceProjection?: Maybe<DevelopmentStanceProjection>;
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

export type SubmitTaskForceEngagementActionInput = {
  action?: InputMaybe<SubmitTaskForceEngagementActionType>;
  cardId?: InputMaybe<Scalars['String']['input']>;
  engagementId: Scalars['ID']['input'];
};

export type SubmitTaskForceEngagementActionType =
  | 'RETREAT';

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackGame: TrackGameEvent;
  trackStarSystem: TrackStarSystemEvent;
  trackTaskForceEngagement: TaskForceEngagement;
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


export type SubscriptiontrackTaskForceEngagementArgs = {
  engagementId: Scalars['ID']['input'];
};

export type TaskForce = Positionable & {
  __typename?: 'TaskForce';
  combatDeck?: Maybe<Array<Scalars['String']['output']>>;
  constructionDone?: Maybe<Scalars['Float']['output']>;
  constructionPerTick?: Maybe<Scalars['Float']['output']>;
  constructionTotal?: Maybe<Scalars['Float']['output']>;
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
};

export type TaskForceColonizeOrder = TaskForceOrder & {
  __typename?: 'TaskForceColonizeOrder';
  id: Scalars['ID']['output'];
};

export type TaskForceEngagement = Positionable & {
  __typename?: 'TaskForceEngagement';
  currentRound: Scalars['Int']['output'];
  game: Game;
  id: Scalars['ID']['output'];
  participantA: TaskForceEngagementParticipantState;
  participantB: TaskForceEngagementParticipantState;
  phase: Scalars['String']['output'];
  position: Scalars['Vector']['output'];
  resolvedAtTurn?: Maybe<Scalars['Int']['output']>;
  roundLog: Array<TaskForceEngagementRoundLogEntry>;
  startedAtTurn: Scalars['Int']['output'];
  taskForceA: TaskForce;
  taskForceB: TaskForce;
  winnerTaskForceId?: Maybe<Scalars['ID']['output']>;
};

export type TaskForceEngagementParticipantState = {
  __typename?: 'TaskForceEngagementParticipantState';
  deckRemaining: Scalars['Int']['output'];
  hand: Array<Scalars['String']['output']>;
  hp: Scalars['Int']['output'];
  maxHp: Scalars['Int']['output'];
  nextDamageBonus: Scalars['Int']['output'];
  nextDamageReduction: Scalars['Int']['output'];
  submittedCardId?: Maybe<Scalars['String']['output']>;
  taskForceId: Scalars['ID']['output'];
};

export type TaskForceEngagementRoundLogEntry = {
  __typename?: 'TaskForceEngagementRoundLogEntry';
  attackerHpAfter: Scalars['Int']['output'];
  attackerTaskForceId: Scalars['ID']['output'];
  cardId: Scalars['String']['output'];
  effectType: Scalars['String']['output'];
  resolvedValue: Scalars['Int']['output'];
  round: Scalars['Int']['output'];
  targetHpAfter: Scalars['Int']['output'];
  targetTaskForceId: Scalars['ID']['output'];
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
  industrialProjectCompletions: Array<TurnReportIndustrialProjectCompletion>;
  industryChanges: Array<TurnReportIndustryChange>;
  miningChanges: Array<TurnReportMiningChange>;
  populationChanges: Array<TurnReportPopulationChange>;
  taskForceConstructionChanges: Array<TurnReportTaskForceConstructionChange>;
  taskForceEngagements: Array<TurnReportTaskForceEngagement>;
  turnNumber: Scalars['Int']['output'];
};

export type TurnReportIndustrialProjectCompletion = {
  __typename?: 'TurnReportIndustrialProjectCompletion';
  industryBonus: Scalars['Int']['output'];
  projectType: IndustrialProjectType;
  starSystem: StarSystem;
};

export type TurnReportIndustryChange = {
  __typename?: 'TurnReportIndustryChange';
  industryTotal: Scalars['Int']['output'];
  industryUtilized: Scalars['Int']['output'];
  starSystem: StarSystem;
};

export type TurnReportMiningChange = {
  __typename?: 'TurnReportMiningChange';
  depotQuantity: Scalars['Float']['output'];
  mined: Scalars['Float']['output'];
  remainingDeposits: Scalars['Float']['output'];
  resource: Resource;
  starSystem: StarSystem;
};

export type TurnReportPopulationChange = {
  __typename?: 'TurnReportPopulationChange';
  growth: Scalars['BigInt']['output'];
  newAmount: Scalars['BigInt']['output'];
  population: Population;
  previousAmount: Scalars['BigInt']['output'];
  starSystem: StarSystem;
};

export type TurnReportTaskForceConstructionChange = {
  __typename?: 'TurnReportTaskForceConstructionChange';
  completed: Scalars['Boolean']['output'];
  newDone: Scalars['Int']['output'];
  perTick: Scalars['Int']['output'];
  previousDone: Scalars['Int']['output'];
  starSystem: StarSystem;
  taskForce: TaskForce;
  total: Scalars['Int']['output'];
};

export type TurnReportTaskForceEngagement = {
  __typename?: 'TurnReportTaskForceEngagement';
  engagementId: Scalars['ID']['output'];
  location: Scalars['Vector']['output'];
  status: Scalars['String']['output'];
  taskForceAId: Scalars['ID']['output'];
  taskForceAName: Scalars['String']['output'];
  taskForceBId: Scalars['ID']['output'];
  taskForceBName: Scalars['String']['output'];
  winnerTaskForceId?: Maybe<Scalars['ID']['output']>;
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
  Positionable: ( StarSystemMapper & { __typename: 'StarSystem' } ) | ( TaskForceMapper & { __typename: 'TaskForce' } ) | ( TaskForceEngagementMapper & { __typename: 'TaskForceEngagement' } );
  TaskForceOrder: ( TaskForceColonizeOrderMapper & { __typename: 'TaskForceColonizeOrder' } ) | ( TaskForceFollowOrderMapper & { __typename: 'TaskForceFollowOrder' } ) | ( TaskForceMoveOrderMapper & { __typename: 'TaskForceMoveOrder' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  ConfigureTaskForceCombatDeckInput: ConfigureTaskForceCombatDeckInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ConstructTaskForceInput: ConstructTaskForceInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DevelopmentStance: ResolverTypeWrapper<'industrialize' | 'balance' | 'grow_population'>;
  DevelopmentStanceProjection: ResolverTypeWrapper<DevelopmentStanceProjection>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Dilemma: ResolverTypeWrapper<DilemmaMapper>;
  DilemmaChoice: ResolverTypeWrapper<DilemmaChoice>;
  Discovery: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Discovery']>;
  Game: ResolverTypeWrapper<GameMapper>;
  IndustrialProject: ResolverTypeWrapper<Omit<IndustrialProject, 'projectType'> & { projectType: ResolversTypes['IndustrialProjectType'] }>;
  IndustrialProjectType: ResolverTypeWrapper<'factory_expansion' | 'automation_hub' | 'orbital_foundry'>;
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
  SubmitTaskForceEngagementActionInput: SubmitTaskForceEngagementActionInput;
  SubmitTaskForceEngagementActionType: ResolverTypeWrapper<'RETREAT'>;
  Subscription: ResolverTypeWrapper<{}>;
  TaskForce: ResolverTypeWrapper<TaskForceMapper>;
  TaskForceColonizeOrder: ResolverTypeWrapper<TaskForceColonizeOrderMapper>;
  TaskForceEngagement: ResolverTypeWrapper<TaskForceEngagementMapper>;
  TaskForceEngagementParticipantState: ResolverTypeWrapper<TaskForceEngagementParticipantStateMapper>;
  TaskForceEngagementRoundLogEntry: ResolverTypeWrapper<TaskForceEngagementRoundLogEntryMapper>;
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
  TurnReportIndustrialProjectCompletion: ResolverTypeWrapper<TurnReportIndustrialProjectCompletionMapper>;
  TurnReportIndustryChange: ResolverTypeWrapper<TurnReportIndustryChangeMapper>;
  TurnReportMiningChange: ResolverTypeWrapper<TurnReportMiningChangeMapper>;
  TurnReportPopulationChange: ResolverTypeWrapper<TurnReportPopulationChangeMapper>;
  TurnReportTaskForceConstructionChange: ResolverTypeWrapper<TurnReportTaskForceConstructionChangeMapper>;
  TurnReportTaskForceEngagement: ResolverTypeWrapper<TurnReportTaskForceEngagement>;
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
  ConfigureTaskForceCombatDeckInput: ConfigureTaskForceCombatDeckInput;
  String: Scalars['String']['output'];
  ID: Scalars['ID']['output'];
  ConstructTaskForceInput: ConstructTaskForceInput;
  DateTime: Scalars['DateTime']['output'];
  DevelopmentStanceProjection: DevelopmentStanceProjection;
  Int: Scalars['Int']['output'];
  Dilemma: DilemmaMapper;
  DilemmaChoice: DilemmaChoice;
  Discovery: ResolversUnionTypes<ResolversParentTypes>['Discovery'];
  Game: GameMapper;
  IndustrialProject: IndustrialProject;
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
  SubmitTaskForceEngagementActionInput: SubmitTaskForceEngagementActionInput;
  Subscription: {};
  TaskForce: TaskForceMapper;
  TaskForceColonizeOrder: TaskForceColonizeOrderMapper;
  TaskForceEngagement: TaskForceEngagementMapper;
  TaskForceEngagementParticipantState: TaskForceEngagementParticipantStateMapper;
  TaskForceEngagementRoundLogEntry: TaskForceEngagementRoundLogEntryMapper;
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
  TurnReportIndustrialProjectCompletion: TurnReportIndustrialProjectCompletionMapper;
  TurnReportIndustryChange: TurnReportIndustryChangeMapper;
  TurnReportMiningChange: TurnReportMiningChangeMapper;
  TurnReportPopulationChange: TurnReportPopulationChangeMapper;
  TurnReportTaskForceConstructionChange: TurnReportTaskForceConstructionChangeMapper;
  TurnReportTaskForceEngagement: TurnReportTaskForceEngagement;
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

export type DevelopmentStanceResolvers = EnumResolverSignature<{ balance?: any, grow_population?: any, industrialize?: any }, ResolversTypes['DevelopmentStance']>;

export type DevelopmentStanceProjectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DevelopmentStanceProjection'] = ResolversParentTypes['DevelopmentStanceProjection']> = {
  industryDelta?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  populationDelta?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  activeTaskForceEngagements?: Resolver<Array<ResolversTypes['TaskForceEngagement']>, ParentType, ContextType>;
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

export type IndustrialProjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IndustrialProject'] = ResolversParentTypes['IndustrialProject']> = {
  completedAtTurn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  completionIndustryBonus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  etaTurns?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  industryPerTurn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectType?: Resolver<ResolversTypes['IndustrialProjectType'], ParentType, ContextType>;
  queuePosition?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  queuedAtTurn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startedAtTurn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  turnsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  workDone?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  workRequired?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndustrialProjectTypeResolvers = EnumResolverSignature<{ automation_hub?: any, factory_expansion?: any, orbital_foundry?: any }, ResolversTypes['IndustrialProjectType']>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  configureTaskForceCombatDeck?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationconfigureTaskForceCombatDeckArgs, 'input'>>;
  constructTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationconstructTaskForceArgs, 'input'>>;
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationcreateGameArgs, 'name'>>;
  createShipDesign?: Resolver<ResolversTypes['ShipDesign'], ParentType, ContextType, RequireFields<MutationcreateShipDesignArgs, 'design' | 'gameId'>>;
  endTurn?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationendTurnArgs, 'expectedTurnNumber' | 'gameId'>>;
  joinGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationjoinGameArgs, 'id'>>;
  loginWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationloginWithPasswordArgs, 'email' | 'password'>>;
  loginWithRefreshToken?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  makeDilemmaChoice?: Resolver<ResolversTypes['Dilemma'], ParentType, ContextType, RequireFields<MutationmakeDilemmaChoiceArgs, 'choiceId' | 'dilemmaId'>>;
  orderTaskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType, RequireFields<MutationorderTaskForceArgs, 'id' | 'orders'>>;
  queueIndustrialProject?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<MutationqueueIndustrialProjectArgs, 'projectType' | 'starSystemId'>>;
  registerWithPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationregisterWithPasswordArgs, 'email' | 'name' | 'password'>>;
  setDevelopmentStance?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<MutationsetDevelopmentStanceArgs, 'stance' | 'starSystemId'>>;
  startColonization?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType, RequireFields<MutationstartColonizationArgs, 'starSystemId'>>;
  startGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationstartGameArgs, 'id'>>;
  submitTaskForceEngagementAction?: Resolver<ResolversTypes['TaskForceEngagement'], ParentType, ContextType, RequireFields<MutationsubmitTaskForceEngagementActionArgs, 'input'>>;
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
  __resolveType?: TypeResolveFn<'StarSystem' | 'TaskForce' | 'TaskForceEngagement', ParentType, ContextType>;
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
  taskForceEngagement?: Resolver<Maybe<ResolversTypes['TaskForceEngagement']>, ParentType, ContextType, RequireFields<QuerytaskForceEngagementArgs, 'id'>>;
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
  completedIndustrialProjects?: Resolver<Array<ResolversTypes['IndustrialProject']>, ParentType, ContextType>;
  currentDevelopmentStance?: Resolver<Maybe<ResolversTypes['DevelopmentStance']>, ParentType, ContextType>;
  discoveries?: Resolver<Maybe<Array<ResolversTypes['Discovery']>>, ParentType, ContextType>;
  discoveryProgress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  industrialProjects?: Resolver<Array<ResolversTypes['IndustrialProject']>, ParentType, ContextType>;
  industry?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextTurnStanceProjection?: Resolver<Maybe<ResolversTypes['DevelopmentStanceProjection']>, ParentType, ContextType>;
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

export type SubmitTaskForceEngagementActionTypeResolvers = EnumResolverSignature<{ RETREAT?: any }, ResolversTypes['SubmitTaskForceEngagementActionType']>;

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  trackGalaxy?: SubscriptionResolver<ResolversTypes['TrackGalaxyEvent'], "trackGalaxy", ParentType, ContextType, RequireFields<SubscriptiontrackGalaxyArgs, 'gameId'>>;
  trackGame?: SubscriptionResolver<ResolversTypes['TrackGameEvent'], "trackGame", ParentType, ContextType, RequireFields<SubscriptiontrackGameArgs, 'gameId'>>;
  trackStarSystem?: SubscriptionResolver<ResolversTypes['TrackStarSystemEvent'], "trackStarSystem", ParentType, ContextType, RequireFields<SubscriptiontrackStarSystemArgs, 'starSystemId'>>;
  trackTaskForceEngagement?: SubscriptionResolver<ResolversTypes['TaskForceEngagement'], "trackTaskForceEngagement", ParentType, ContextType, RequireFields<SubscriptiontrackTaskForceEngagementArgs, 'engagementId'>>;
};

export type TaskForceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForce'] = ResolversParentTypes['TaskForce']> = {
  combatDeck?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  constructionDone?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  constructionPerTick?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  constructionTotal?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceColonizeOrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceColonizeOrder'] = ResolversParentTypes['TaskForceColonizeOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagement'] = ResolversParentTypes['TaskForceEngagement']> = {
  currentRound?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  participantA?: Resolver<ResolversTypes['TaskForceEngagementParticipantState'], ParentType, ContextType>;
  participantB?: Resolver<ResolversTypes['TaskForceEngagementParticipantState'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  resolvedAtTurn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  roundLog?: Resolver<Array<ResolversTypes['TaskForceEngagementRoundLogEntry']>, ParentType, ContextType>;
  startedAtTurn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taskForceA?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType>;
  taskForceB?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType>;
  winnerTaskForceId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementParticipantStateResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagementParticipantState'] = ResolversParentTypes['TaskForceEngagementParticipantState']> = {
  deckRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hand?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  hp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maxHp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextDamageBonus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextDamageReduction?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  submittedCardId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskForceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskForceEngagementRoundLogEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaskForceEngagementRoundLogEntry'] = ResolversParentTypes['TaskForceEngagementRoundLogEntry']> = {
  attackerHpAfter?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  attackerTaskForceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cardId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  effectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolvedValue?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  round?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  targetHpAfter?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  targetTaskForceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  industrialProjectCompletions?: Resolver<Array<ResolversTypes['TurnReportIndustrialProjectCompletion']>, ParentType, ContextType>;
  industryChanges?: Resolver<Array<ResolversTypes['TurnReportIndustryChange']>, ParentType, ContextType>;
  miningChanges?: Resolver<Array<ResolversTypes['TurnReportMiningChange']>, ParentType, ContextType>;
  populationChanges?: Resolver<Array<ResolversTypes['TurnReportPopulationChange']>, ParentType, ContextType>;
  taskForceConstructionChanges?: Resolver<Array<ResolversTypes['TurnReportTaskForceConstructionChange']>, ParentType, ContextType>;
  taskForceEngagements?: Resolver<Array<ResolversTypes['TurnReportTaskForceEngagement']>, ParentType, ContextType>;
  turnNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportIndustrialProjectCompletionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportIndustrialProjectCompletion'] = ResolversParentTypes['TurnReportIndustrialProjectCompletion']> = {
  industryBonus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectType?: Resolver<ResolversTypes['IndustrialProjectType'], ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportIndustryChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportIndustryChange'] = ResolversParentTypes['TurnReportIndustryChange']> = {
  industryTotal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  industryUtilized?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportMiningChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportMiningChange'] = ResolversParentTypes['TurnReportMiningChange']> = {
  depotQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  mined?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  remainingDeposits?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  resource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportPopulationChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportPopulationChange'] = ResolversParentTypes['TurnReportPopulationChange']> = {
  growth?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  newAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  population?: Resolver<ResolversTypes['Population'], ParentType, ContextType>;
  previousAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportTaskForceConstructionChangeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportTaskForceConstructionChange'] = ResolversParentTypes['TurnReportTaskForceConstructionChange']> = {
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  newDone?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perTick?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  previousDone?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  starSystem?: Resolver<ResolversTypes['StarSystem'], ParentType, ContextType>;
  taskForce?: Resolver<ResolversTypes['TaskForce'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnReportTaskForceEngagementResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TurnReportTaskForceEngagement'] = ResolversParentTypes['TurnReportTaskForceEngagement']> = {
  engagementId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Vector'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taskForceAId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskForceAName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taskForceBId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  taskForceBName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  winnerTaskForceId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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
  DevelopmentStance?: DevelopmentStanceResolvers;
  DevelopmentStanceProjection?: DevelopmentStanceProjectionResolvers<ContextType>;
  Dilemma?: DilemmaResolvers<ContextType>;
  DilemmaChoice?: DilemmaChoiceResolvers<ContextType>;
  Discovery?: DiscoveryResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  IndustrialProject?: IndustrialProjectResolvers<ContextType>;
  IndustrialProjectType?: IndustrialProjectTypeResolvers;
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
  SubmitTaskForceEngagementActionType?: SubmitTaskForceEngagementActionTypeResolvers;
  Subscription?: SubscriptionResolvers<ContextType>;
  TaskForce?: TaskForceResolvers<ContextType>;
  TaskForceColonizeOrder?: TaskForceColonizeOrderResolvers<ContextType>;
  TaskForceEngagement?: TaskForceEngagementResolvers<ContextType>;
  TaskForceEngagementParticipantState?: TaskForceEngagementParticipantStateResolvers<ContextType>;
  TaskForceEngagementRoundLogEntry?: TaskForceEngagementRoundLogEntryResolvers<ContextType>;
  TaskForceFollowOrder?: TaskForceFollowOrderResolvers<ContextType>;
  TaskForceMoveOrder?: TaskForceMoveOrderResolvers<ContextType>;
  TaskForceOrder?: TaskForceOrderResolvers<ContextType>;
  TaskForceShipRole?: TaskForceShipRoleResolvers;
  TrackGalaxyEvent?: TrackGalaxyEventResolvers<ContextType>;
  TrackGameEvent?: TrackGameEventResolvers<ContextType>;
  TrackStarSystemEvent?: TrackStarSystemEventResolvers<ContextType>;
  TurnEndedEvent?: TurnEndedEventResolvers<ContextType>;
  TurnReport?: TurnReportResolvers<ContextType>;
  TurnReportIndustrialProjectCompletion?: TurnReportIndustrialProjectCompletionResolvers<ContextType>;
  TurnReportIndustryChange?: TurnReportIndustryChangeResolvers<ContextType>;
  TurnReportMiningChange?: TurnReportMiningChangeResolvers<ContextType>;
  TurnReportPopulationChange?: TurnReportPopulationChangeResolvers<ContextType>;
  TurnReportTaskForceConstructionChange?: TurnReportTaskForceConstructionChangeResolvers<ContextType>;
  TurnReportTaskForceEngagement?: TurnReportTaskForceEngagementResolvers<ContextType>;
  UnknownDiscovery?: UnknownDiscoveryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vector?: GraphQLScalarType;
  WeaponDeliveryType?: WeaponDeliveryTypeResolvers;
};

