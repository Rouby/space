/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation RefreshLogin {\n    loginWithRefreshToken {\n      id\n    }\n  }": types.RefreshLoginDocument,
    "mutation CommisionTaskForce($starSystemId: ID!) {\n    createTaskForceCommision(starSystemId: $starSystemId) {\n      id\n      progress\n      total\n    }\n  }": types.CommisionTaskForceDocument,
    "query StarSystemDetails($id: ID!) {\n\t\tstarSystem(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\ttaskForceCommisions {\n\t\t\t\tid\n\t\t\t\tprogress\n\t\t\t\ttotal\n\t\t\t}\n\t\t\ttaskForces {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}": types.StarSystemDetailsDocument,
    "query TaskForceCommision($id: ID!) {\n\t\ttaskForceCommision(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t}": types.TaskForceCommisionDocument,
    "subscription TaskForceCommisionSub($id: ID!) {\n\t\ttaskForceCommisionProgress(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t\t}": types.TaskForceCommisionSubDocument,
    "subscription TaskForceCommisionFinishedSub($id: ID!) {\n\t\ttaskForceCommisionFinished(id: $id) {\n\t\t\tid\n\t\t\ttaskForce{\n\t\t\t\tid\n\t\t\t\tposition\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t}": types.TaskForceCommisionFinishedSubDocument,
    "\nquery Galaxy($id: ID!) {\n  game(id: $id) {\n    id\n\t\tstarSystems {\n\t\t\tid\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t\ttaskForces {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n  }\n}": types.GalaxyDocument,
    "mutation MoveTaskForce($id: ID!, $position: Vector!) {\n\t\tmoveTaskForce(id: $id, position: $position) {\n\t\t\tid\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}": types.MoveTaskForceDocument,
    "subscription TaskForceMovements{\n\t\ttrackTaskForces {\n\t\t\tid\n\t\t\tposition\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n\t}": types.TaskForceMovementsDocument,
    "query GameLobby($id: ID!) {\n      game(id: $id) {\n        id\n        name\n        players {\n          id\n          user {\n            id\n            name\n          }\n        }\n      }\n    }": types.GameLobbyDocument,
    "mutation StartGame($id:ID!) {\n    startGame(id: $id) {\n      id\n      startedAt\n    }\n  }": types.StartGameDocument,
    "\nquery Games {\n  games {\n    id\n    name\n\t\tstartedAt\t\n\t\tplayers {\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n  }\n}": types.GamesDocument,
    "mutation JoinGame($id: ID!) {\n\t\tjoinGame(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tplayers {\n\t\t\t\tid\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}": types.JoinGameDocument,
    "\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}": types.SignInDocument,
    "mutation CreateGame($name: String!) {\n\t\tcreateGame(name: $name) {\n\t\t\tid\n\t\t\tname\n\t\t}}": types.CreateGameDocument,
    "\n    mutation SignIn($email: String!, $password: String!) {\n      loginWithPassword(email: $email, password: $password) {\n        id\n        name\n      }\n    }": types.SignInDocument,
    "\n    mutation SignUp($email: String!, $password: String!, $name:String!) {\n      registerWithPassword(email: $email, password: $password, name: $name) {\n        id\n        name\n      }\n    }": types.SignUpDocument,
    "\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}": types.RefreshAuthDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RefreshLogin {\n    loginWithRefreshToken {\n      id\n    }\n  }"): (typeof documents)["mutation RefreshLogin {\n    loginWithRefreshToken {\n      id\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommisionTaskForce($starSystemId: ID!) {\n    createTaskForceCommision(starSystemId: $starSystemId) {\n      id\n      progress\n      total\n    }\n  }"): (typeof documents)["mutation CommisionTaskForce($starSystemId: ID!) {\n    createTaskForceCommision(starSystemId: $starSystemId) {\n      id\n      progress\n      total\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query StarSystemDetails($id: ID!) {\n\t\tstarSystem(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\ttaskForceCommisions {\n\t\t\t\tid\n\t\t\t\tprogress\n\t\t\t\ttotal\n\t\t\t}\n\t\t\ttaskForces {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"): (typeof documents)["query StarSystemDetails($id: ID!) {\n\t\tstarSystem(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\ttaskForceCommisions {\n\t\t\t\tid\n\t\t\t\tprogress\n\t\t\t\ttotal\n\t\t\t}\n\t\t\ttaskForces {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TaskForceCommision($id: ID!) {\n\t\ttaskForceCommision(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t}"): (typeof documents)["query TaskForceCommision($id: ID!) {\n\t\ttaskForceCommision(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription TaskForceCommisionSub($id: ID!) {\n\t\ttaskForceCommisionProgress(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t\t}"): (typeof documents)["subscription TaskForceCommisionSub($id: ID!) {\n\t\ttaskForceCommisionProgress(id: $id) {\n\t\t\tid\n\t\t\tprogress\n\t\t\ttotal\n\t\t}\n\t\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription TaskForceCommisionFinishedSub($id: ID!) {\n\t\ttaskForceCommisionFinished(id: $id) {\n\t\t\tid\n\t\t\ttaskForce{\n\t\t\t\tid\n\t\t\t\tposition\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t}"): (typeof documents)["subscription TaskForceCommisionFinishedSub($id: ID!) {\n\t\ttaskForceCommisionFinished(id: $id) {\n\t\t\tid\n\t\t\ttaskForce{\n\t\t\t\tid\n\t\t\t\tposition\n\t\t\t\towner {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Galaxy($id: ID!) {\n  game(id: $id) {\n    id\n\t\tstarSystems {\n\t\t\tid\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t\ttaskForces {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n  }\n}"): (typeof documents)["\nquery Galaxy($id: ID!) {\n  game(id: $id) {\n    id\n\t\tstarSystems {\n\t\t\tid\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t\ttaskForces {\n\t\t\tid\n\t\t\tname\n\t\t\tposition\n\t\t\towner {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation MoveTaskForce($id: ID!, $position: Vector!) {\n\t\tmoveTaskForce(id: $id, position: $position) {\n\t\t\tid\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"): (typeof documents)["mutation MoveTaskForce($id: ID!, $position: Vector!) {\n\t\tmoveTaskForce(id: $id, position: $position) {\n\t\t\tid\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription TaskForceMovements{\n\t\ttrackTaskForces {\n\t\t\tid\n\t\t\tposition\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n\t}"): (typeof documents)["subscription TaskForceMovements{\n\t\ttrackTaskForces {\n\t\t\tid\n\t\t\tposition\n\t\t\torders {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\t...on TaskForceMoveOrder {\n\t\t\t\t\tdestination\n\t\t\t\t}\n\t\t\t}\n\t\t\tmovementVector\n\t\t}\n\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameLobby($id: ID!) {\n      game(id: $id) {\n        id\n        name\n        players {\n          id\n          user {\n            id\n            name\n          }\n        }\n      }\n    }"): (typeof documents)["query GameLobby($id: ID!) {\n      game(id: $id) {\n        id\n        name\n        players {\n          id\n          user {\n            id\n            name\n          }\n        }\n      }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation StartGame($id:ID!) {\n    startGame(id: $id) {\n      id\n      startedAt\n    }\n  }"): (typeof documents)["mutation StartGame($id:ID!) {\n    startGame(id: $id) {\n      id\n      startedAt\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Games {\n  games {\n    id\n    name\n\t\tstartedAt\t\n\t\tplayers {\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n  }\n}"): (typeof documents)["\nquery Games {\n  games {\n    id\n    name\n\t\tstartedAt\t\n\t\tplayers {\n\t\t\tid\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation JoinGame($id: ID!) {\n\t\tjoinGame(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tplayers {\n\t\t\t\tid\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"): (typeof documents)["mutation JoinGame($id: ID!) {\n\t\tjoinGame(id: $id) {\n\t\t\tid\n\t\t\tname\n\t\t\tplayers {\n\t\t\t\tid\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}"): (typeof documents)["\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateGame($name: String!) {\n\t\tcreateGame(name: $name) {\n\t\t\tid\n\t\t\tname\n\t\t}}"): (typeof documents)["mutation CreateGame($name: String!) {\n\t\tcreateGame(name: $name) {\n\t\t\tid\n\t\t\tname\n\t\t}}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignIn($email: String!, $password: String!) {\n      loginWithPassword(email: $email, password: $password) {\n        id\n        name\n      }\n    }"): (typeof documents)["\n    mutation SignIn($email: String!, $password: String!) {\n      loginWithPassword(email: $email, password: $password) {\n        id\n        name\n      }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignUp($email: String!, $password: String!, $name:String!) {\n      registerWithPassword(email: $email, password: $password, name: $name) {\n        id\n        name\n      }\n    }"): (typeof documents)["\n    mutation SignUp($email: String!, $password: String!, $name:String!) {\n      registerWithPassword(email: $email, password: $password, name: $name) {\n        id\n        name\n      }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}"): (typeof documents)["\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;