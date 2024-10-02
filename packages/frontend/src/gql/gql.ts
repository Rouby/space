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
    "\nquery Galaxy {\n  planets {\n    id\n    name\n    position\n  }\n}": types.GalaxyDocument,
    "\nquery Games {\n  games {\n    id\n    name\n  }\n}": types.GamesDocument,
    "\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}": types.SignInDocument,
    "\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}": types.RefreshAuthDocument,
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
export function graphql(source: "\nquery Galaxy {\n  planets {\n    id\n    name\n    position\n  }\n}"): (typeof documents)["\nquery Galaxy {\n  planets {\n    id\n    name\n    position\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Games {\n  games {\n    id\n    name\n  }\n}"): (typeof documents)["\nquery Games {\n  games {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}"): (typeof documents)["\nmutation SignIn($email:String!, $password:String!) {\n  loginWithPassword(email: $email, password: $password) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}"): (typeof documents)["\n\t\t\t\t\tmutation RefreshAuth {\n\t\t\t\t\t\tloginWithRefreshToken {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t}\n\t\t\t\t\t}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;