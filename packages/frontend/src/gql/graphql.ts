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

export type ConfigureTaskForceCombatDeckInput = {
  cardIds: Array<Scalars['String']['input']>;
  taskForceId: Scalars['ID']['input'];
};

export type ConstructTaskForceInput = {
  name: Scalars['String']['input'];
  shipDesignId: Scalars['ID']['input'];
  starSystemId: Scalars['ID']['input'];
};

export enum DevelopmentStance {
  Balance = 'balance',
  GrowPopulation = 'grow_population',
  Industrialize = 'industrialize'
}

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


export type GameTurnReportsArgs = {
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

export enum IndustrialProjectType {
  AutomationHub = 'automation_hub',
  FactoryExpansion = 'factory_expansion',
  OrbitalFoundry = 'orbital_foundry'
}

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


export type MutationConfigureTaskForceCombatDeckArgs = {
  input: ConfigureTaskForceCombatDeckInput;
};


export type MutationConstructTaskForceArgs = {
  input: ConstructTaskForceInput;
};


export type MutationCreateGameArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateShipDesignArgs = {
  design: ShipDesignInput;
  gameId: Scalars['ID']['input'];
};


export type MutationEndTurnArgs = {
  expectedTurnNumber: Scalars['Int']['input'];
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


export type MutationQueueIndustrialProjectArgs = {
  projectType: IndustrialProjectType;
  starSystemId: Scalars['ID']['input'];
};


export type MutationRegisterWithPasswordArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSetDevelopmentStanceArgs = {
  stance: DevelopmentStance;
  starSystemId: Scalars['ID']['input'];
};


export type MutationStartColonizationArgs = {
  starSystemId: Scalars['ID']['input'];
};


export type MutationStartGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitTaskForceEngagementActionArgs = {
  input: SubmitTaskForceEngagementActionInput;
};


export type MutationUpdateGameSettingsArgs = {
  gameId: Scalars['ID']['input'];
  input: UpdateGameSettingsInput;
};


export type MutationUpdatePlayerArgs = {
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


export type QueryDilemmaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStarSystemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaskForceEngagementArgs = {
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

export enum SubmitTaskForceEngagementActionType {
  Retreat = 'RETREAT'
}

export type Subscription = {
  __typename?: 'Subscription';
  trackGalaxy: TrackGalaxyEvent;
  trackGame: TrackGameEvent;
  trackStarSystem: TrackStarSystemEvent;
  trackTaskForceEngagement: TaskForceEngagement;
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


export type SubscriptionTrackTaskForceEngagementArgs = {
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

export enum TaskForceShipRole {
  Capital = 'capital',
  Screen = 'screen',
  Support = 'support'
}

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

export enum WeaponDeliveryType {
  Beam = 'beam',
  Instant = 'instant',
  Missile = 'missile',
  Projectile = 'projectile'
}

export type RefreshLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshLoginMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename?: 'User', id: string } };

export type CombatEngagementPanelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CombatEngagementPanelQuery = { __typename?: 'Query', taskForceEngagement?: { __typename?: 'TaskForceEngagement', id: string, phase: string, currentRound: number, winnerTaskForceId?: string | null, taskForceA: { __typename?: 'TaskForce', id: string, name: string, owner?: { __typename?: 'Player', id: string, name: string, user: { __typename?: 'User', id: string } } | null }, taskForceB: { __typename?: 'TaskForce', id: string, name: string, owner?: { __typename?: 'Player', id: string, name: string, user: { __typename?: 'User', id: string } } | null }, participantA: { __typename?: 'TaskForceEngagementParticipantState', taskForceId: string, hp: number, maxHp: number, hand: Array<string>, deckRemaining: number, submittedCardId?: string | null }, participantB: { __typename?: 'TaskForceEngagementParticipantState', taskForceId: string, hp: number, maxHp: number, hand: Array<string>, deckRemaining: number, submittedCardId?: string | null }, roundLog: Array<{ __typename?: 'TaskForceEngagementRoundLogEntry', round: number, attackerTaskForceId: string, targetTaskForceId: string, cardId: string, effectType: string, resolvedValue: number, attackerHpAfter: number, targetHpAfter: number }> } | null };

export type TrackTaskForceEngagementSubscriptionVariables = Exact<{
  engagementId: Scalars['ID']['input'];
}>;


export type TrackTaskForceEngagementSubscription = { __typename?: 'Subscription', trackTaskForceEngagement: { __typename?: 'TaskForceEngagement', id: string, phase: string, currentRound: number } };

export type SubmitTaskForceEngagementActionMutationVariables = Exact<{
  input: SubmitTaskForceEngagementActionInput;
}>;


export type SubmitTaskForceEngagementActionMutation = { __typename?: 'Mutation', submitTaskForceEngagementAction: { __typename?: 'TaskForceEngagement', id: string, phase: string, currentRound: number } };

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

export type NextPendingDilemmaQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type NextPendingDilemmaQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, dilemmas: Array<{ __typename?: 'Dilemma', id: string, choosen?: string | null, causation?: { __typename?: 'Dilemma', id: string } | { __typename?: 'StarSystem' } | null }> } };

export type DilemmasHistoryListQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type DilemmasHistoryListQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, dilemmas: Array<{ __typename?: 'Dilemma', id: string, title: string, question: string, choosen?: string | null, choices: Array<{ __typename?: 'DilemmaChoice', id: string, title: string }> }> } };

export type GalaxyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GalaxyQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, starSystems: Array<{ __typename?: 'StarSystem', id: string, position: {x:number;y:number}, isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string, user: { __typename?: 'User', id: string } } | null }>, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, position: {x:number;y:number}, constructionDone?: number | null, constructionTotal?: number | null, movementVector?: {x:number;y:number} | null, isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string, user: { __typename?: 'User', id: string } } | null, orders?: Array<{ __typename: 'TaskForceColonizeOrder', id: string } | { __typename: 'TaskForceFollowOrder', id: string } | { __typename: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null }>, activeTaskForceEngagements: Array<{ __typename?: 'TaskForceEngagement', id: string, phase: string, currentRound: number, position: {x:number;y:number}, taskForceA: { __typename?: 'TaskForce', id: string }, taskForceB: { __typename?: 'TaskForce', id: string } }>, dilemmas: Array<{ __typename?: 'Dilemma', id: string, title: string, question: string, description: string, choosen?: string | null, position?: {x:number;y:number} | null, choices: Array<{ __typename?: 'DilemmaChoice', id: string, title: string, description: string }>, correlation?: { __typename?: 'Dilemma', id: string, title: string } | { __typename?: 'StarSystem', id: string, position: {x:number;y:number} } | null }> } };

export type OrderTaskForceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  orders: Array<TaskForceOrderInput> | TaskForceOrderInput;
  queue?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type OrderTaskForceMutation = { __typename?: 'Mutation', orderTaskForce: { __typename?: 'TaskForce', id: string, orders?: Array<{ __typename?: 'TaskForceColonizeOrder', id: string } | { __typename?: 'TaskForceFollowOrder', id: string } | { __typename?: 'TaskForceMoveOrder', destination: {x:number;y:number}, id: string }> | null } };

export type TrackMapSubscriptionVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type TrackMapSubscription = { __typename?: 'Subscription', trackGalaxy: { __typename?: 'PositionableApppearsEvent', subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number}, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, movementVector?: {x:number;y:number} | null, sensorRange?: number | null, constructionDone?: number | null, constructionTotal?: number | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForceEngagement', id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableDisappearsEvent', removed?: boolean | null, subject: { __typename: 'StarSystem', isVisible: boolean, lastUpdate?: any | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', isVisible: boolean, lastUpdate?: any | null, sensorRange?: number | null, constructionDone?: number | null, constructionTotal?: number | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForceEngagement', id: string, position: {x:number;y:number} } } | { __typename?: 'PositionableMovesEvent', subject: { __typename: 'StarSystem', id: string, position: {x:number;y:number} } | { __typename: 'TaskForce', movementVector?: {x:number;y:number} | null, id: string, position: {x:number;y:number} } | { __typename: 'TaskForceEngagement', id: string, position: {x:number;y:number} } } | { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, sensorRange?: number | null, owner?: { __typename?: 'Player', id: string, name: string, color: string } | null } } };

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


export type CurrentTurnEndedQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, turnNumber: number, dilemmas: Array<{ __typename?: 'Dilemma', id: string, choosen?: string | null }>, me?: { __typename?: 'Player', id: string, turnEnded?: boolean | null } | null } };

export type CurrentTurnSubscriptionVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type CurrentTurnSubscription = { __typename?: 'Subscription', trackGame: { __typename: 'NewTurnCalculatedEvent', game: { __typename?: 'Game', id: string, turnNumber: number, players: Array<{ __typename?: 'Player', id: string, turnEnded?: boolean | null }> } } | { __typename: 'TurnEndedEvent' } };

export type EndTurnMutationVariables = Exact<{
  expectedTurnNumber: Scalars['Int']['input'];
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

export type CommissionFleetContextPanelQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type CommissionFleetContextPanelQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string, shipDesigns: Array<{ __typename?: 'ShipDesign', id: string, name: string, components: Array<{ __typename?: 'ShipDesignComponent', component: { __typename?: 'ShipComponent', constructionCost: number } }> }> } | null } };

export type CommissionTaskForceStarSystemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CommissionTaskForceStarSystemQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, industry?: number | null, owner?: { __typename?: 'Player', id: string } | null } };

export type TrackCommissionTaskForceStarSystemSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackCommissionTaskForceStarSystemSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, industry?: number | null, owner?: { __typename?: 'Player', id: string } | null } } };

export type ConstructTaskForceMutationVariables = Exact<{
  input: ConstructTaskForceInput;
}>;


export type ConstructTaskForceMutation = { __typename?: 'Mutation', constructTaskForce: { __typename?: 'TaskForce', id: string, name: string } };

export type DeckConfigurationStarSystemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeckConfigurationStarSystemQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, combatDeck?: Array<string> | null }> } };

export type TrackDeckConfigurationStarSystemSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackDeckConfigurationStarSystemSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, combatDeck?: Array<string> | null }> } } };

export type ConfigureTaskForceCombatDeckPanelMutationVariables = Exact<{
  input: ConfigureTaskForceCombatDeckInput;
}>;


export type ConfigureTaskForceCombatDeckPanelMutation = { __typename?: 'Mutation', configureTaskForceCombatDeck: { __typename?: 'TaskForce', id: string, combatDeck?: Array<string> | null } };

export type IndustrialProjectsContextQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type IndustrialProjectsContextQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string } | null } };

export type IndustrialProjectsStarSystemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IndustrialProjectsStarSystemQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, owner?: { __typename?: 'Player', id: string } | null, industrialProjects: Array<{ __typename?: 'IndustrialProject', id: string, projectType: IndustrialProjectType, industryPerTurn: number, workRequired: number, workDone: number, completionIndustryBonus: number, queuePosition: number, turnsRemaining: number, etaTurns: number }>, completedIndustrialProjects: Array<{ __typename?: 'IndustrialProject', id: string, projectType: IndustrialProjectType, completionIndustryBonus: number, completedAtTurn?: number | null }> } };

export type TrackIndustrialProjectsStarSystemSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackIndustrialProjectsStarSystemSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, owner?: { __typename?: 'Player', id: string } | null, industrialProjects: Array<{ __typename?: 'IndustrialProject', id: string, projectType: IndustrialProjectType, industryPerTurn: number, workRequired: number, workDone: number, completionIndustryBonus: number, queuePosition: number, turnsRemaining: number, etaTurns: number }>, completedIndustrialProjects: Array<{ __typename?: 'IndustrialProject', id: string, projectType: IndustrialProjectType, completionIndustryBonus: number, completedAtTurn?: number | null }> } } };

export type QueueIndustrialProjectMutationVariables = Exact<{
  starSystemId: Scalars['ID']['input'];
  projectType: IndustrialProjectType;
}>;


export type QueueIndustrialProjectMutation = { __typename?: 'Mutation', queueIndustrialProject: { __typename?: 'StarSystem', id: string, industrialProjects: Array<{ __typename?: 'IndustrialProject', id: string }> } };

export type StarSystemDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StarSystemDetailsQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, name: string, currentDevelopmentStance?: DevelopmentStance | null, position: {x:number;y:number}, industry?: number | null, discoveryProgress?: number | null, nextTurnStanceProjection?: { __typename?: 'DevelopmentStanceProjection', industryDelta: number, populationDelta: number } | null, owner?: { __typename?: 'Player', id: string, name: string } | null, colonization?: { __typename?: 'StarSystemColonization', turnsRemaining: number, player: { __typename?: 'Player', id: string, name: string } } | null, taskForces: Array<{ __typename?: 'TaskForce', id: string }>, discoveries?: Array<{ __typename: 'ResourceDiscovery', id: string, remainingDeposits: number, miningRate: number, resource: { __typename?: 'Resource', id: string, name: string } } | { __typename: 'UnknownDiscovery', id: string }> | null, populations?: Array<{ __typename?: 'Population', id: string, amount: number }> | null } };

export type StarSystemDetailsContextQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type StarSystemDetailsContextQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string } | null } };

export type TrackStarSystemDetailsSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackStarSystemDetailsSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, name: string, currentDevelopmentStance?: DevelopmentStance | null, position: {x:number;y:number}, industry?: number | null, discoveryProgress?: number | null, nextTurnStanceProjection?: { __typename?: 'DevelopmentStanceProjection', industryDelta: number, populationDelta: number } | null, owner?: { __typename?: 'Player', id: string, name: string } | null, colonization?: { __typename?: 'StarSystemColonization', turnsRemaining: number, player: { __typename?: 'Player', id: string, name: string } } | null, taskForces: Array<{ __typename?: 'TaskForce', id: string }>, discoveries?: Array<{ __typename: 'ResourceDiscovery', id: string, remainingDeposits: number, miningRate: number, resource: { __typename?: 'Resource', id: string, name: string } } | { __typename: 'UnknownDiscovery', id: string }> | null, populations?: Array<{ __typename?: 'Population', id: string, amount: number }> | null } } };

export type StartColonizationMutationVariables = Exact<{
  starSystemId: Scalars['ID']['input'];
}>;


export type StartColonizationMutation = { __typename?: 'Mutation', startColonization: { __typename?: 'StarSystem', id: string, colonization?: { __typename?: 'StarSystemColonization', turnsRemaining: number, player: { __typename?: 'Player', id: string, name: string } } | null } };

export type SetDevelopmentStanceMutationVariables = Exact<{
  starSystemId: Scalars['ID']['input'];
  stance: DevelopmentStance;
}>;


export type SetDevelopmentStanceMutation = { __typename?: 'Mutation', setDevelopmentStance: { __typename?: 'StarSystem', id: string, currentDevelopmentStance?: DevelopmentStance | null, nextTurnStanceProjection?: { __typename?: 'DevelopmentStanceProjection', industryDelta: number, populationDelta: number } | null } };

export type TaskForcesContextPanelQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type TaskForcesContextPanelQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, me?: { __typename?: 'Player', id: string } | null } };

export type TaskForcesStarSystemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskForcesStarSystemQuery = { __typename?: 'Query', starSystem: { __typename?: 'StarSystem', id: string, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, combatDeck?: Array<string> | null, constructionDone?: number | null, constructionTotal?: number | null, constructionPerTick?: number | null, owner?: { __typename?: 'Player', id: string, name: string } | null }> } };

export type TrackTaskForcesStarSystemSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TrackTaskForcesStarSystemSubscription = { __typename?: 'Subscription', trackStarSystem: { __typename?: 'StarSystemUpdateEvent', subject: { __typename?: 'StarSystem', id: string, taskForces: Array<{ __typename?: 'TaskForce', id: string, name: string, combatDeck?: Array<string> | null, constructionDone?: number | null, constructionTotal?: number | null, constructionPerTick?: number | null, owner?: { __typename?: 'Player', id: string, name: string } | null }> } } };

export type TurnReportsDetailsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type TurnReportsDetailsQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: string, turnReports: Array<{ __typename?: 'TurnReport', id: string, turnNumber: number, createdAt: any, populationChanges: Array<{ __typename?: 'TurnReportPopulationChange', previousAmount: number, newAmount: number, growth: number, starSystem: { __typename?: 'StarSystem', id: string, name: string }, population: { __typename?: 'Population', id: string } }>, miningChanges: Array<{ __typename?: 'TurnReportMiningChange', mined: number, remainingDeposits: number, depotQuantity: number, starSystem: { __typename?: 'StarSystem', id: string, name: string }, resource: { __typename?: 'Resource', id: string, name: string } }>, industryChanges: Array<{ __typename?: 'TurnReportIndustryChange', industryTotal: number, industryUtilized: number, starSystem: { __typename?: 'StarSystem', id: string, name: string } }>, industrialProjectCompletions: Array<{ __typename?: 'TurnReportIndustrialProjectCompletion', projectType: IndustrialProjectType, industryBonus: number, starSystem: { __typename?: 'StarSystem', id: string, name: string } }>, taskForceConstructionChanges: Array<{ __typename?: 'TurnReportTaskForceConstructionChange', previousDone: number, newDone: number, total: number, perTick: number, completed: boolean, taskForce: { __typename?: 'TaskForce', id: string, name: string }, starSystem: { __typename?: 'StarSystem', id: string, name: string } }>, taskForceEngagements: Array<{ __typename?: 'TurnReportTaskForceEngagement', engagementId: string, status: string, taskForceAId: string, taskForceBId: string, taskForceAName: string, taskForceBName: string, winnerTaskForceId?: string | null, location: {x:number;y:number} }> }> } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name: string, email: string } | null };

export type RefreshAuthMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAuthMutation = { __typename?: 'Mutation', loginWithRefreshToken: { __typename: 'User', id: string } };


export const RefreshLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshLogin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshLoginMutation, RefreshLoginMutationVariables>;
export const CombatEngagementPanelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CombatEngagementPanel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceEngagement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}},{"kind":"Field","name":{"kind":"Name","value":"winnerTaskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForceB"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"participantA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"hand"}},{"kind":"Field","name":{"kind":"Name","value":"deckRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCardId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"participantB"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}},{"kind":"Field","name":{"kind":"Name","value":"maxHp"}},{"kind":"Field","name":{"kind":"Name","value":"hand"}},{"kind":"Field","name":{"kind":"Name","value":"deckRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"submittedCardId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roundLog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"round"}},{"kind":"Field","name":{"kind":"Name","value":"attackerTaskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"targetTaskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"cardId"}},{"kind":"Field","name":{"kind":"Name","value":"effectType"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedValue"}},{"kind":"Field","name":{"kind":"Name","value":"attackerHpAfter"}},{"kind":"Field","name":{"kind":"Name","value":"targetHpAfter"}}]}}]}}]}}]} as unknown as DocumentNode<CombatEngagementPanelQuery, CombatEngagementPanelQueryVariables>;
export const TrackTaskForceEngagementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackTaskForceEngagement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"engagementId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackTaskForceEngagement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"engagementId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"engagementId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}}]}}]}}]} as unknown as DocumentNode<TrackTaskForceEngagementSubscription, TrackTaskForceEngagementSubscriptionVariables>;
export const SubmitTaskForceEngagementActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitTaskForceEngagementAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitTaskForceEngagementActionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitTaskForceEngagementAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}}]}}]}}]} as unknown as DocumentNode<SubmitTaskForceEngagementActionMutation, SubmitTaskForceEngagementActionMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const DilemmaDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DilemmaDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dilemma"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"correlation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dilemma"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DilemmaDetailsQuery, DilemmaDetailsQueryVariables>;
export const MakeDilemmaChoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MakeDilemmaChoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"choiceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"makeDilemmaChoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dilemmaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"choiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"choiceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}}]}}]}}]} as unknown as DocumentNode<MakeDilemmaChoiceMutation, MakeDilemmaChoiceMutationVariables>;
export const NextPendingDilemmaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NextPendingDilemma"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"causation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dilemma"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NextPendingDilemmaQuery, NextPendingDilemmaQueryVariables>;
export const DilemmasHistoryListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DilemmasHistoryList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DilemmasHistoryListQuery, DilemmasHistoryListQueryVariables>;
export const GalaxyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Galaxy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"constructionDone"}},{"kind":"Field","name":{"kind":"Name","value":"constructionTotal"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeTaskForceEngagements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForceB"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"correlation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Dilemma"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GalaxyQuery, GalaxyQueryVariables>;
export const OrderTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orders"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceOrderInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queue"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderTaskForce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"orders"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orders"}}},{"kind":"Argument","name":{"kind":"Name","value":"queue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destination"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderTaskForceMutation, OrderTaskForceMutationVariables>;
export const TrackMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackGalaxy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableApppearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"movementVector"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}},{"kind":"Field","name":{"kind":"Name","value":"constructionDone"}},{"kind":"Field","name":{"kind":"Name","value":"constructionTotal"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableMovesEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movementVector"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PositionableDisappearsEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}},{"kind":"Field","name":{"kind":"Name","value":"constructionDone"}},{"kind":"Field","name":{"kind":"Name","value":"constructionTotal"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"removed"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackMapSubscription, TrackMapSubscriptionVariables>;
export const GameLobbyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameLobby"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnAfterHoursInactive"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnEveryHours"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameLobbyQuery, GameLobbyQueryVariables>;
export const StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartGameMutation, StartGameMutationVariables>;
export const UpdatePlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlayerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerMutation, UpdatePlayerMutationVariables>;
export const UpdateGameSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGameSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnAfterHoursInactive"}},{"kind":"Field","name":{"kind":"Name","value":"autoEndTurnEveryHours"}}]}}]}}]} as unknown as DocumentNode<UpdateGameSettingsMutation, UpdateGameSettingsMutationVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const JoinGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const NotificationCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationCountQuery, NotificationCountQueryVariables>;
export const CurrentTurnEndedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentTurnEnded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dilemmas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"choosen"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnEnded"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentTurnEndedQuery, CurrentTurnEndedQueryVariables>;
export const CurrentTurnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CurrentTurn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NewTurnCalculatedEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnEnded"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CurrentTurnSubscription, CurrentTurnSubscriptionVariables>;
export const EndTurnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndTurn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expectedTurnNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endTurn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"expectedTurnNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expectedTurnNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EndTurnMutation, EndTurnMutationVariables>;
export const ShipComponentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipComponents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipComponents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedPassive"}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedMovement"}},{"kind":"Field","name":{"kind":"Name","value":"supplyNeedCombat"}},{"kind":"Field","name":{"kind":"Name","value":"powerNeed"}},{"kind":"Field","name":{"kind":"Name","value":"crewNeed"}},{"kind":"Field","name":{"kind":"Name","value":"constructionCost"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"powerGeneration"}},{"kind":"Field","name":{"kind":"Name","value":"crewCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"ftlSpeed"}},{"kind":"Field","name":{"kind":"Name","value":"zoneOfControl"}},{"kind":"Field","name":{"kind":"Name","value":"sensorRange"}},{"kind":"Field","name":{"kind":"Name","value":"structuralIntegrity"}},{"kind":"Field","name":{"kind":"Name","value":"thruster"}},{"kind":"Field","name":{"kind":"Name","value":"sensorPrecision"}},{"kind":"Field","name":{"kind":"Name","value":"armorThickness"}},{"kind":"Field","name":{"kind":"Name","value":"armorEffectivenessAgainst"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectile"}},{"kind":"Field","name":{"kind":"Name","value":"missile"}},{"kind":"Field","name":{"kind":"Name","value":"beam"}},{"kind":"Field","name":{"kind":"Name","value":"instant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shieldStrength"}},{"kind":"Field","name":{"kind":"Name","value":"shieldEffectivenessAgainst"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectile"}},{"kind":"Field","name":{"kind":"Name","value":"missile"}},{"kind":"Field","name":{"kind":"Name","value":"beam"}},{"kind":"Field","name":{"kind":"Name","value":"instant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weaponDamage"}},{"kind":"Field","name":{"kind":"Name","value":"weaponCooldown"}},{"kind":"Field","name":{"kind":"Name","value":"weaponRange"}},{"kind":"Field","name":{"kind":"Name","value":"weaponArmorPenetration"}},{"kind":"Field","name":{"kind":"Name","value":"weaponShieldPenetration"}},{"kind":"Field","name":{"kind":"Name","value":"weaponAccuracy"}},{"kind":"Field","name":{"kind":"Name","value":"weaponDeliveryType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipComponentsQuery, ShipComponentsQueryVariables>;
export const CreateShipDesignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShipDesign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"design"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShipDesign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"design"},"value":{"kind":"Variable","name":{"kind":"Name","value":"design"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<CreateShipDesignMutation, CreateShipDesignMutationVariables>;
export const ShipDesignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShipDesigns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipDesigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShipDesignsQuery, ShipDesignsQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const CommissionFleetContextPanelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommissionFleetContextPanel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shipDesigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"components"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"constructionCost"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommissionFleetContextPanelQuery, CommissionFleetContextPanelQueryVariables>;
export const CommissionTaskForceStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommissionTaskForceStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CommissionTaskForceStarSystemQuery, CommissionTaskForceStarSystemQueryVariables>;
export const TrackCommissionTaskForceStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackCommissionTaskForceStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackCommissionTaskForceStarSystemSubscription, TrackCommissionTaskForceStarSystemSubscriptionVariables>;
export const ConstructTaskForceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConstructTaskForce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConstructTaskForceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"constructTaskForce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ConstructTaskForceMutation, ConstructTaskForceMutationVariables>;
export const DeckConfigurationStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeckConfigurationStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"combatDeck"}}]}}]}}]}}]} as unknown as DocumentNode<DeckConfigurationStarSystemQuery, DeckConfigurationStarSystemQueryVariables>;
export const TrackDeckConfigurationStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackDeckConfigurationStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"combatDeck"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackDeckConfigurationStarSystemSubscription, TrackDeckConfigurationStarSystemSubscriptionVariables>;
export const ConfigureTaskForceCombatDeckPanelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfigureTaskForceCombatDeckPanel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigureTaskForceCombatDeckInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"configureTaskForceCombatDeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"combatDeck"}}]}}]}}]} as unknown as DocumentNode<ConfigureTaskForceCombatDeckPanelMutation, ConfigureTaskForceCombatDeckPanelMutationVariables>;
export const IndustrialProjectsContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IndustrialProjectsContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<IndustrialProjectsContextQuery, IndustrialProjectsContextQueryVariables>;
export const IndustrialProjectsStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IndustrialProjectsStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industrialProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"industryPerTurn"}},{"kind":"Field","name":{"kind":"Name","value":"workRequired"}},{"kind":"Field","name":{"kind":"Name","value":"workDone"}},{"kind":"Field","name":{"kind":"Name","value":"completionIndustryBonus"}},{"kind":"Field","name":{"kind":"Name","value":"queuePosition"}},{"kind":"Field","name":{"kind":"Name","value":"turnsRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"etaTurns"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completedIndustrialProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"completionIndustryBonus"}},{"kind":"Field","name":{"kind":"Name","value":"completedAtTurn"}}]}}]}}]}}]} as unknown as DocumentNode<IndustrialProjectsStarSystemQuery, IndustrialProjectsStarSystemQueryVariables>;
export const TrackIndustrialProjectsStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackIndustrialProjectsStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industrialProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"industryPerTurn"}},{"kind":"Field","name":{"kind":"Name","value":"workRequired"}},{"kind":"Field","name":{"kind":"Name","value":"workDone"}},{"kind":"Field","name":{"kind":"Name","value":"completionIndustryBonus"}},{"kind":"Field","name":{"kind":"Name","value":"queuePosition"}},{"kind":"Field","name":{"kind":"Name","value":"turnsRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"etaTurns"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completedIndustrialProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"completionIndustryBonus"}},{"kind":"Field","name":{"kind":"Name","value":"completedAtTurn"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackIndustrialProjectsStarSystemSubscription, TrackIndustrialProjectsStarSystemSubscriptionVariables>;
export const QueueIndustrialProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"QueueIndustrialProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IndustrialProjectType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueIndustrialProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"industrialProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<QueueIndustrialProjectMutation, QueueIndustrialProjectMutationVariables>;
export const StarSystemDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StarSystemDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentDevelopmentStance"}},{"kind":"Field","name":{"kind":"Name","value":"nextTurnStanceProjection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"industryDelta"}},{"kind":"Field","name":{"kind":"Name","value":"populationDelta"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"colonization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"turnsRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"discoveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"miningRate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveryProgress"}},{"kind":"Field","name":{"kind":"Name","value":"populations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]} as unknown as DocumentNode<StarSystemDetailsQuery, StarSystemDetailsQueryVariables>;
export const StarSystemDetailsContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StarSystemDetailsContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<StarSystemDetailsContextQuery, StarSystemDetailsContextQueryVariables>;
export const TrackStarSystemDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackStarSystemDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentDevelopmentStance"}},{"kind":"Field","name":{"kind":"Name","value":"nextTurnStanceProjection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"industryDelta"}},{"kind":"Field","name":{"kind":"Name","value":"populationDelta"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"colonization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"turnsRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"discoveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"miningRate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discoveryProgress"}},{"kind":"Field","name":{"kind":"Name","value":"populations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackStarSystemDetailsSubscription, TrackStarSystemDetailsSubscriptionVariables>;
export const StartColonizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartColonization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startColonization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"colonization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"turnsRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartColonizationMutation, StartColonizationMutationVariables>;
export const SetDevelopmentStanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevelopmentStance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stance"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DevelopmentStance"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDevelopmentStance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"starSystemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stance"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentDevelopmentStance"}},{"kind":"Field","name":{"kind":"Name","value":"nextTurnStanceProjection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"industryDelta"}},{"kind":"Field","name":{"kind":"Name","value":"populationDelta"}}]}}]}}]}}]} as unknown as DocumentNode<SetDevelopmentStanceMutation, SetDevelopmentStanceMutationVariables>;
export const TaskForcesContextPanelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskForcesContextPanel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TaskForcesContextPanelQuery, TaskForcesContextPanelQueryVariables>;
export const TaskForcesStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TaskForcesStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"combatDeck"}},{"kind":"Field","name":{"kind":"Name","value":"constructionDone"}},{"kind":"Field","name":{"kind":"Name","value":"constructionTotal"}},{"kind":"Field","name":{"kind":"Name","value":"constructionPerTick"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TaskForcesStarSystemQuery, TaskForcesStarSystemQueryVariables>;
export const TrackTaskForcesStarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrackTaskForcesStarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"starSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystemUpdateEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"taskForces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"combatDeck"}},{"kind":"Field","name":{"kind":"Name","value":"constructionDone"}},{"kind":"Field","name":{"kind":"Name","value":"constructionTotal"}},{"kind":"Field","name":{"kind":"Name","value":"constructionPerTick"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TrackTaskForcesStarSystemSubscription, TrackTaskForcesStarSystemSubscriptionVariables>;
export const TurnReportsDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TurnReportsDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"40"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"turnNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"populationChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"population"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousAmount"}},{"kind":"Field","name":{"kind":"Name","value":"newAmount"}},{"kind":"Field","name":{"kind":"Name","value":"growth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"miningChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mined"}},{"kind":"Field","name":{"kind":"Name","value":"remainingDeposits"}},{"kind":"Field","name":{"kind":"Name","value":"depotQuantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industryChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industryTotal"}},{"kind":"Field","name":{"kind":"Name","value":"industryUtilized"}}]}},{"kind":"Field","name":{"kind":"Name","value":"industrialProjectCompletions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"industryBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForceConstructionChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskForce"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousDone"}},{"kind":"Field","name":{"kind":"Name","value":"newDone"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"perTick"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskForceEngagements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagementId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceAId"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceBId"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceAName"}},{"kind":"Field","name":{"kind":"Name","value":"taskForceBName"}},{"kind":"Field","name":{"kind":"Name","value":"winnerTaskForceId"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TurnReportsDetailsQuery, TurnReportsDetailsQueryVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const RefreshAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithRefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RefreshAuthMutation, RefreshAuthMutationVariables>;