/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated.js';
    import    { games as Query_games } from './game/resolvers/Query/games.js';
import    { planets as Query_planets } from './planet/resolvers/Query/planets.js';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword.js';
import    { loginWithRefreshToken as Mutation_loginWithRefreshToken } from './user/resolvers/Mutation/loginWithRefreshToken.js';
import    { registerWithPassword as Mutation_registerWithPassword } from './user/resolvers/Mutation/registerWithPassword.js';
import    { Game } from './game/resolvers/Game.js';
import    { Planet } from './planet/resolvers/Planet.js';
import    { User } from './user/resolvers/User.js';
import    { Vector } from './planet/resolvers/Vector.js';
    export const resolvers: Resolvers = {
      Query: { games: Query_games,planets: Query_planets },
      Mutation: { loginWithPassword: Mutation_loginWithPassword,loginWithRefreshToken: Mutation_loginWithRefreshToken,registerWithPassword: Mutation_registerWithPassword },
      
      Game: Game,
Planet: Planet,
User: User,
Vector: Vector
    }