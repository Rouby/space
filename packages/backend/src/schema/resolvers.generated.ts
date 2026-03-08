/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated.js';
    import    { dilemma as Query_dilemma } from './dilemma/resolvers/Query/dilemma.js';
import    { game as Query_game } from './game/resolvers/Query/game.js';
import    { games as Query_games } from './game/resolvers/Query/games.js';
import    { me as Query_me } from './user/resolvers/Query/me.js';
import    { starSystem as Query_starSystem } from './starSystem/resolvers/Query/starSystem.js';
import    { constructTaskForce as Mutation_constructTaskForce } from './taskForce/resolvers/Mutation/constructTaskForce.js';
import    { createGame as Mutation_createGame } from './game/resolvers/Mutation/createGame.js';
import    { createShipDesign as Mutation_createShipDesign } from './shipDesign/resolvers/Mutation/createShipDesign.js';
import    { endTurn as Mutation_endTurn } from './game/resolvers/Mutation/endTurn.js';
import    { joinGame as Mutation_joinGame } from './game/resolvers/Mutation/joinGame.js';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword.js';
import    { loginWithRefreshToken as Mutation_loginWithRefreshToken } from './user/resolvers/Mutation/loginWithRefreshToken.js';
import    { makeDilemmaChoice as Mutation_makeDilemmaChoice } from './dilemma/resolvers/Mutation/makeDilemmaChoice.js';
import    { orderTaskForce as Mutation_orderTaskForce } from './taskForce/resolvers/Mutation/orderTaskForce.js';
import    { registerWithPassword as Mutation_registerWithPassword } from './user/resolvers/Mutation/registerWithPassword.js';
import    { startColonization as Mutation_startColonization } from './starSystem/resolvers/Mutation/startColonization.js';
import    { startGame as Mutation_startGame } from './game/resolvers/Mutation/startGame.js';
import    { updateGameSettings as Mutation_updateGameSettings } from './game/resolvers/Mutation/updateGameSettings.js';
import    { updatePlayer as Mutation_updatePlayer } from './game/resolvers/Mutation/updatePlayer.js';
import    { trackGalaxy as Subscription_trackGalaxy } from './base/resolvers/Subscription/trackGalaxy.js';
import    { trackGame as Subscription_trackGame } from './game/resolvers/Subscription/trackGame.js';
import    { trackStarSystem as Subscription_trackStarSystem } from './base/resolvers/Subscription/trackStarSystem.js';
import    { Dilemma } from './dilemma/resolvers/Dilemma.js';
import    { DilemmaChoice } from './dilemma/resolvers/DilemmaChoice.js';
import    { Game as game_Game } from './game/resolvers/Game.js';
import    { Game as dilemma_Game } from './dilemma/resolvers/Game.js';
import    { Game as resource_Game } from './resource/resolvers/Game.js';
import    { Game as shipComponent_Game } from './shipComponent/resolvers/Game.js';
import    { Game as shipDesign_Game } from './shipDesign/resolvers/Game.js';
import    { Game as starSystem_Game } from './starSystem/resolvers/Game.js';
import    { Game as taskForce_Game } from './taskForce/resolvers/Game.js';
import    { NewTurnCalculatedEvent } from './game/resolvers/NewTurnCalculatedEvent.js';
import    { Player as game_Player } from './game/resolvers/Player.js';
import    { Player as resource_Player } from './resource/resolvers/Player.js';
import    { Player as shipComponent_Player } from './shipComponent/resolvers/Player.js';
import    { Player as shipDesign_Player } from './shipDesign/resolvers/Player.js';
import    { Population } from './starSystem/resolvers/Population.js';
import    { PositionableApppearsEvent } from './base/resolvers/PositionableApppearsEvent.js';
import    { PositionableDisappearsEvent } from './base/resolvers/PositionableDisappearsEvent.js';
import    { PositionableMovesEvent } from './base/resolvers/PositionableMovesEvent.js';
import    { Resource } from './resource/resolvers/Resource.js';
import    { ResourceCost } from './resource/resolvers/ResourceCost.js';
import    { ResourceDiscovery } from './starSystem/resolvers/ResourceDiscovery.js';
import    { ShipComponent } from './shipComponent/resolvers/ShipComponent.js';
import    { ShipComponentEffectivenessAgainst } from './shipComponent/resolvers/ShipComponentEffectivenessAgainst.js';
import    { ShipDesign } from './shipDesign/resolvers/ShipDesign.js';
import    { ShipDesignComponent } from './shipDesign/resolvers/ShipDesignComponent.js';
import    { StarSystem as starSystem_StarSystem } from './starSystem/resolvers/StarSystem.js';
import    { StarSystem as taskForce_StarSystem } from './taskForce/resolvers/StarSystem.js';
import    { StarSystemColonization } from './starSystem/resolvers/StarSystemColonization.js';
import    { StarSystemUpdateEvent } from './base/resolvers/StarSystemUpdateEvent.js';
import    { TaskForce } from './taskForce/resolvers/TaskForce.js';
import    { TaskForceColonizeOrder } from './taskForce/resolvers/TaskForceColonizeOrder.js';
import    { TaskForceFollowOrder } from './taskForce/resolvers/TaskForceFollowOrder.js';
import    { TaskForceMoveOrder } from './taskForce/resolvers/TaskForceMoveOrder.js';
import    { TurnEndedEvent } from './game/resolvers/TurnEndedEvent.js';
import    { TurnReport } from './game/resolvers/TurnReport.js';
import    { TurnReportMiningChange } from './game/resolvers/TurnReportMiningChange.js';
import    { TurnReportPopulationChange } from './game/resolvers/TurnReportPopulationChange.js';
import    { UnknownDiscovery } from './starSystem/resolvers/UnknownDiscovery.js';
import    { User } from './user/resolvers/User.js';
import    { Vector } from './base/resolvers/Vector.js';
import    { Positionable } from './base/resolvers/Positionable.js';
import    { TaskForceOrder } from './taskForce/resolvers/TaskForceOrder.js';
import    { Discovery } from './starSystem/resolvers/Discovery.js';
import    { Reference } from './dilemma/resolvers/Reference.js';
import    { TrackGalaxyEvent } from './base/resolvers/TrackGalaxyEvent.js';
import    { TrackGameEvent } from './game/resolvers/TrackGameEvent.js';
import    { TrackStarSystemEvent } from './base/resolvers/TrackStarSystemEvent.js';
import    { BigIntResolver,DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { dilemma: Query_dilemma,game: Query_game,games: Query_games,me: Query_me,starSystem: Query_starSystem },
      Mutation: { constructTaskForce: Mutation_constructTaskForce,createGame: Mutation_createGame,createShipDesign: Mutation_createShipDesign,endTurn: Mutation_endTurn,joinGame: Mutation_joinGame,loginWithPassword: Mutation_loginWithPassword,loginWithRefreshToken: Mutation_loginWithRefreshToken,makeDilemmaChoice: Mutation_makeDilemmaChoice,orderTaskForce: Mutation_orderTaskForce,registerWithPassword: Mutation_registerWithPassword,startColonization: Mutation_startColonization,startGame: Mutation_startGame,updateGameSettings: Mutation_updateGameSettings,updatePlayer: Mutation_updatePlayer },
      Subscription: { trackGalaxy: Subscription_trackGalaxy,trackGame: Subscription_trackGame,trackStarSystem: Subscription_trackStarSystem },
      Dilemma: Dilemma,
DilemmaChoice: DilemmaChoice,
Game: { ...game_Game,...dilemma_Game,...resource_Game,...shipComponent_Game,...shipDesign_Game,...starSystem_Game,...taskForce_Game },
NewTurnCalculatedEvent: NewTurnCalculatedEvent,
Player: { ...game_Player,...resource_Player,...shipComponent_Player,...shipDesign_Player },
Population: Population,
PositionableApppearsEvent: PositionableApppearsEvent,
PositionableDisappearsEvent: PositionableDisappearsEvent,
PositionableMovesEvent: PositionableMovesEvent,
Resource: Resource,
ResourceCost: ResourceCost,
ResourceDiscovery: ResourceDiscovery,
ShipComponent: ShipComponent,
ShipComponentEffectivenessAgainst: ShipComponentEffectivenessAgainst,
ShipDesign: ShipDesign,
ShipDesignComponent: ShipDesignComponent,
StarSystem: { ...starSystem_StarSystem,...taskForce_StarSystem },
StarSystemColonization: StarSystemColonization,
StarSystemUpdateEvent: StarSystemUpdateEvent,
TaskForce: TaskForce,
TaskForceColonizeOrder: TaskForceColonizeOrder,
TaskForceFollowOrder: TaskForceFollowOrder,
TaskForceMoveOrder: TaskForceMoveOrder,
TurnEndedEvent: TurnEndedEvent,
TurnReport: TurnReport,
TurnReportMiningChange: TurnReportMiningChange,
TurnReportPopulationChange: TurnReportPopulationChange,
UnknownDiscovery: UnknownDiscovery,
User: User,
Vector: Vector,
Positionable: Positionable,
TaskForceOrder: TaskForceOrder,
Discovery: Discovery,
Reference: Reference,
TrackGalaxyEvent: TrackGalaxyEvent,
TrackGameEvent: TrackGameEvent,
TrackStarSystemEvent: TrackStarSystemEvent,
BigInt: BigIntResolver,
DateTime: DateTimeResolver
    }