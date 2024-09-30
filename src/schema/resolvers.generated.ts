/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { _dummy as Query__dummy } from './user/resolvers/Query/_dummy';
import    { loginWithPassword as Mutation_loginWithPassword } from './user/resolvers/Mutation/loginWithPassword';
import    { User } from './user/resolvers/User';
    export const resolvers: Resolvers = {
      Query: { _dummy: Query__dummy },
      Mutation: { loginWithPassword: Mutation_loginWithPassword },
      
      User: User
    }