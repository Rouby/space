/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated.js';
    import    { game as Query_game } from './game/resolvers/Query/game.js';
import    { games as Query_games } from './game/resolvers/Query/games.js';
import    { me as Query_me } from './user/resolvers/Query/me.js';
import    { createGame as Mutation_createGame } from './game/resolvers/Mutation/createGame.js';
import    { joinGame as Mutation_joinGame } from './game/resolvers/Mutation/joinGame.js';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword.js';
import    { loginWithRefreshToken as Mutation_loginWithRefreshToken } from './user/resolvers/Mutation/loginWithRefreshToken.js';
import    { registerWithPassword as Mutation_registerWithPassword } from './user/resolvers/Mutation/registerWithPassword.js';
import    { startGame as Mutation_startGame } from './game/resolvers/Mutation/startGame.js';
import    { Game as game_Game } from './game/resolvers/Game.js';
import    { Game as starSystem_Game } from './starSystem/resolvers/Game.js';
import    { Player } from './game/resolvers/Player.js';
import    { StarSystem } from './starSystem/resolvers/StarSystem.js';
import    { User } from './user/resolvers/User.js';
import    { Vector } from './starSystem/resolvers/Vector.js';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { game: Query_game,games: Query_games,me: Query_me },
      Mutation: { createGame: Mutation_createGame,joinGame: Mutation_joinGame,loginWithPassword: Mutation_loginWithPassword,loginWithRefreshToken: Mutation_loginWithRefreshToken,registerWithPassword: Mutation_registerWithPassword,startGame: Mutation_startGame },
      
      Game: { ...game_Game,...starSystem_Game },
Player: Player,
StarSystem: StarSystem,
User: User,
Vector: Vector,
DateTime: DateTimeResolver
    }