/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated.js';
    import    { game as Query_game } from './game/resolvers/Query/game.js';
import    { games as Query_games } from './game/resolvers/Query/games.js';
import    { me as Query_me } from './user/resolvers/Query/me.js';
import    { starSystem as Query_starSystem } from './starSystem/resolvers/Query/starSystem.js';
import    { taskForceEngagement as Query_taskForceEngagement } from './taskForceEngagement/resolvers/Query/taskForceEngagement.js';
import    { taskForceShipCommision as Query_taskForceShipCommision } from './taskForce/resolvers/Query/taskForceShipCommision.js';
import    { createGame as Mutation_createGame } from './game/resolvers/Mutation/createGame.js';
import    { createShipDesign as Mutation_createShipDesign } from './shipDesign/resolvers/Mutation/createShipDesign.js';
import    { createTaskForceCommision as Mutation_createTaskForceCommision } from './taskForce/resolvers/Mutation/createTaskForceCommision.js';
import    { joinGame as Mutation_joinGame } from './game/resolvers/Mutation/joinGame.js';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword.js';
import    { loginWithRefreshToken as Mutation_loginWithRefreshToken } from './user/resolvers/Mutation/loginWithRefreshToken.js';
import    { orderTaskForce as Mutation_orderTaskForce } from './taskForce/resolvers/Mutation/orderTaskForce.js';
import    { registerWithPassword as Mutation_registerWithPassword } from './user/resolvers/Mutation/registerWithPassword.js';
import    { startGame as Mutation_startGame } from './game/resolvers/Mutation/startGame.js';
import    { trackGalaxy as Subscription_trackGalaxy } from './base/resolvers/Subscription/trackGalaxy.js';
import    { trackStarSystem as Subscription_trackStarSystem } from './base/resolvers/Subscription/trackStarSystem.js';
import    { trackTaskForceEngagement as Subscription_trackTaskForceEngagement } from './taskForceEngagement/resolvers/Subscription/trackTaskForceEngagement.js';
import    { Game as game_Game } from './game/resolvers/Game.js';
import    { Game as resource_Game } from './resource/resolvers/Game.js';
import    { Game as shipComponent_Game } from './shipComponent/resolvers/Game.js';
import    { Game as shipDesign_Game } from './shipDesign/resolvers/Game.js';
import    { Game as starSystem_Game } from './starSystem/resolvers/Game.js';
import    { Game as taskForceEngagement_Game } from './taskForceEngagement/resolvers/Game.js';
import    { Game as taskForce_Game } from './taskForce/resolvers/Game.js';
import    { Player as game_Player } from './game/resolvers/Player.js';
import    { Player as resource_Player } from './resource/resolvers/Player.js';
import    { Player as shipComponent_Player } from './shipComponent/resolvers/Player.js';
import    { Player as shipDesign_Player } from './shipDesign/resolvers/Player.js';
import    { Population } from './starSystem/resolvers/Population.js';
import    { PositionableApppearsEvent } from './base/resolvers/PositionableApppearsEvent.js';
import    { PositionableDisappearsEvent } from './base/resolvers/PositionableDisappearsEvent.js';
import    { PositionableMovesEvent } from './base/resolvers/PositionableMovesEvent.js';
import    { Resource } from './resource/resolvers/Resource.js';
import    { ResourceCost } from './shipDesign/resolvers/ResourceCost.js';
import    { ResourceDepot } from './starSystem/resolvers/ResourceDepot.js';
import    { ResourceDiscovery } from './starSystem/resolvers/ResourceDiscovery.js';
import    { ResourceNeed } from './resource/resolvers/ResourceNeed.js';
import    { ShipComponent } from './shipComponent/resolvers/ShipComponent.js';
import    { ShipComponentEffectivenessAgainst } from './shipComponent/resolvers/ShipComponentEffectivenessAgainst.js';
import    { ShipDesign } from './shipDesign/resolvers/ShipDesign.js';
import    { StarSystem as starSystem_StarSystem } from './starSystem/resolvers/StarSystem.js';
import    { StarSystem as taskForce_StarSystem } from './taskForce/resolvers/StarSystem.js';
import    { StarSystemUpdateEvent } from './base/resolvers/StarSystemUpdateEvent.js';
import    { TaskForce } from './taskForce/resolvers/TaskForce.js';
import    { TaskForceColonizeOrder } from './taskForce/resolvers/TaskForceColonizeOrder.js';
import    { TaskForceCommisionUpdateEvent } from './base/resolvers/TaskForceCommisionUpdateEvent.js';
import    { TaskForceEngagement } from './taskForceEngagement/resolvers/TaskForceEngagement.js';
import    { TaskForceEngagementProgressEvent } from './taskForceEngagement/resolvers/TaskForceEngagementProgressEvent.js';
import    { TaskForceEngagementWeaponFiredEvent } from './taskForceEngagement/resolvers/TaskForceEngagementWeaponFiredEvent.js';
import    { TaskForceFollowOrder } from './taskForce/resolvers/TaskForceFollowOrder.js';
import    { TaskForceJoinsEngagementEvent } from './base/resolvers/TaskForceJoinsEngagementEvent.js';
import    { TaskForceLeavesEngagementEvent } from './base/resolvers/TaskForceLeavesEngagementEvent.js';
import    { TaskForceMoveOrder } from './taskForce/resolvers/TaskForceMoveOrder.js';
import    { TaskForceShip } from './taskForce/resolvers/TaskForceShip.js';
import    { TaskForceShipCommision } from './taskForce/resolvers/TaskForceShipCommision.js';
import    { TaskForceShipComponent } from './taskForce/resolvers/TaskForceShipComponent.js';
import    { UnknownDiscovery } from './starSystem/resolvers/UnknownDiscovery.js';
import    { User } from './user/resolvers/User.js';
import    { Vector } from './base/resolvers/Vector.js';
import    { Positionable } from './base/resolvers/Positionable.js';
import    { TaskForceOrder } from './taskForce/resolvers/TaskForceOrder.js';
import    { BigIntResolver,DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { game: Query_game,games: Query_games,me: Query_me,starSystem: Query_starSystem,taskForceEngagement: Query_taskForceEngagement,taskForceShipCommision: Query_taskForceShipCommision },
      Mutation: { createGame: Mutation_createGame,createShipDesign: Mutation_createShipDesign,createTaskForceCommision: Mutation_createTaskForceCommision,joinGame: Mutation_joinGame,loginWithPassword: Mutation_loginWithPassword,loginWithRefreshToken: Mutation_loginWithRefreshToken,orderTaskForce: Mutation_orderTaskForce,registerWithPassword: Mutation_registerWithPassword,startGame: Mutation_startGame },
      Subscription: { trackGalaxy: Subscription_trackGalaxy,trackStarSystem: Subscription_trackStarSystem,trackTaskForceEngagement: Subscription_trackTaskForceEngagement },
      Game: { ...game_Game,...resource_Game,...shipComponent_Game,...shipDesign_Game,...starSystem_Game,...taskForceEngagement_Game,...taskForce_Game },
Player: { ...game_Player,...resource_Player,...shipComponent_Player,...shipDesign_Player },
Population: Population,
PositionableApppearsEvent: PositionableApppearsEvent,
PositionableDisappearsEvent: PositionableDisappearsEvent,
PositionableMovesEvent: PositionableMovesEvent,
Resource: Resource,
ResourceCost: ResourceCost,
ResourceDepot: ResourceDepot,
ResourceDiscovery: ResourceDiscovery,
ResourceNeed: ResourceNeed,
ShipComponent: ShipComponent,
ShipComponentEffectivenessAgainst: ShipComponentEffectivenessAgainst,
ShipDesign: ShipDesign,
StarSystem: { ...starSystem_StarSystem,...taskForce_StarSystem },
StarSystemUpdateEvent: StarSystemUpdateEvent,
TaskForce: TaskForce,
TaskForceColonizeOrder: TaskForceColonizeOrder,
TaskForceCommisionUpdateEvent: TaskForceCommisionUpdateEvent,
TaskForceEngagement: TaskForceEngagement,
TaskForceEngagementProgressEvent: TaskForceEngagementProgressEvent,
TaskForceEngagementWeaponFiredEvent: TaskForceEngagementWeaponFiredEvent,
TaskForceFollowOrder: TaskForceFollowOrder,
TaskForceJoinsEngagementEvent: TaskForceJoinsEngagementEvent,
TaskForceLeavesEngagementEvent: TaskForceLeavesEngagementEvent,
TaskForceMoveOrder: TaskForceMoveOrder,
TaskForceShip: TaskForceShip,
TaskForceShipCommision: TaskForceShipCommision,
TaskForceShipComponent: TaskForceShipComponent,
UnknownDiscovery: UnknownDiscovery,
User: User,
Vector: Vector,
Positionable: Positionable,
TaskForceOrder: TaskForceOrder,
BigInt: BigIntResolver,
DateTime: DateTimeResolver
    }