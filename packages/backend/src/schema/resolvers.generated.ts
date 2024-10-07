/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated.js';
    import    { game as Query_game } from './game/resolvers/Query/game.js';
import    { games as Query_games } from './game/resolvers/Query/games.js';
import    { me as Query_me } from './user/resolvers/Query/me.js';
import    { starSystem as Query_starSystem } from './starSystem/resolvers/Query/starSystem.js';
import    { taskForceCommision as Query_taskForceCommision } from './taskForce/resolvers/Query/taskForceCommision.js';
import    { createGame as Mutation_createGame } from './game/resolvers/Mutation/createGame.js';
import    { createTaskForceCommision as Mutation_createTaskForceCommision } from './taskForce/resolvers/Mutation/createTaskForceCommision.js';
import    { joinGame as Mutation_joinGame } from './game/resolvers/Mutation/joinGame.js';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword.js';
import    { loginWithRefreshToken as Mutation_loginWithRefreshToken } from './user/resolvers/Mutation/loginWithRefreshToken.js';
import    { moveTaskForce as Mutation_moveTaskForce } from './taskForce/resolvers/Mutation/moveTaskForce.js';
import    { queueTaskForceMove as Mutation_queueTaskForceMove } from './taskForce/resolvers/Mutation/queueTaskForceMove.js';
import    { registerWithPassword as Mutation_registerWithPassword } from './user/resolvers/Mutation/registerWithPassword.js';
import    { startGame as Mutation_startGame } from './game/resolvers/Mutation/startGame.js';
import    { taskForceCommisionFinished as Subscription_taskForceCommisionFinished } from './taskForce/resolvers/Subscription/taskForceCommisionFinished.js';
import    { taskForceCommisionProgress as Subscription_taskForceCommisionProgress } from './taskForce/resolvers/Subscription/taskForceCommisionProgress.js';
import    { trackMap as Subscription_trackMap } from './starSystem/resolvers/Subscription/trackMap.js';
import    { trackTaskForces as Subscription_trackTaskForces } from './taskForce/resolvers/Subscription/trackTaskForces.js';
import    { Game as game_Game } from './game/resolvers/Game.js';
import    { Game as starSystem_Game } from './starSystem/resolvers/Game.js';
import    { Game as taskForce_Game } from './taskForce/resolvers/Game.js';
import    { Player } from './game/resolvers/Player.js';
import    { StarSystem as starSystem_StarSystem } from './starSystem/resolvers/StarSystem.js';
import    { StarSystem as taskForce_StarSystem } from './taskForce/resolvers/StarSystem.js';
import    { TaskForce } from './taskForce/resolvers/TaskForce.js';
import    { TaskForceCommision } from './taskForce/resolvers/TaskForceCommision.js';
import    { TaskForceCommisionFinished } from './taskForce/resolvers/TaskForceCommisionFinished.js';
import    { TaskForceMoveOrder } from './taskForce/resolvers/TaskForceMoveOrder.js';
import    { TrackEvent } from './starSystem/resolvers/TrackEvent.js';
import    { User } from './user/resolvers/User.js';
import    { Vector } from './base/resolvers/Vector.js';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { game: Query_game,games: Query_games,me: Query_me,starSystem: Query_starSystem,taskForceCommision: Query_taskForceCommision },
      Mutation: { createGame: Mutation_createGame,createTaskForceCommision: Mutation_createTaskForceCommision,joinGame: Mutation_joinGame,loginWithPassword: Mutation_loginWithPassword,loginWithRefreshToken: Mutation_loginWithRefreshToken,moveTaskForce: Mutation_moveTaskForce,queueTaskForceMove: Mutation_queueTaskForceMove,registerWithPassword: Mutation_registerWithPassword,startGame: Mutation_startGame },
      Subscription: { taskForceCommisionFinished: Subscription_taskForceCommisionFinished,taskForceCommisionProgress: Subscription_taskForceCommisionProgress,trackMap: Subscription_trackMap,trackTaskForces: Subscription_trackTaskForces },
      Game: { ...game_Game,...starSystem_Game,...taskForce_Game },
Player: Player,
StarSystem: { ...starSystem_StarSystem,...taskForce_StarSystem },
TaskForce: TaskForce,
TaskForceCommision: TaskForceCommision,
TaskForceCommisionFinished: TaskForceCommisionFinished,
TaskForceMoveOrder: TaskForceMoveOrder,
TrackEvent: TrackEvent,
User: User,
Vector: Vector,
DateTime: DateTimeResolver
    }