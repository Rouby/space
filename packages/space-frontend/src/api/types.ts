export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: string;
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: string;
  /** A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone. */
  Datetime: Date;
  /** A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) which securely represents claims between two parties. */
  Jwt: string;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: "Query";
  /** Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form. */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars["ID"];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Game`. */
  games?: Maybe<GamesConnection>;
  /** Reads and enables pagination through a set of `Person`. */
  people?: Maybe<PeopleConnection>;
  /** Reads and enables pagination through a set of `Planet`. */
  planets?: Maybe<PlanetsConnection>;
  /** Reads and enables pagination through a set of `Player`. */
  players?: Maybe<PlayersConnection>;
  /** Reads and enables pagination through a set of `Race`. */
  races?: Maybe<RacesConnection>;
  game?: Maybe<Game>;
  person?: Maybe<Person>;
  planet?: Maybe<Planet>;
  player?: Maybe<Player>;
  race?: Maybe<Race>;
  currentPerson?: Maybe<Person>;
  /** Reads a single `Game` using its globally unique `ID`. */
  gameByNodeId?: Maybe<Game>;
  /** Reads a single `Person` using its globally unique `ID`. */
  personByNodeId?: Maybe<Person>;
  /** Reads a single `Planet` using its globally unique `ID`. */
  planetByNodeId?: Maybe<Planet>;
  /** Reads a single `Player` using its globally unique `ID`. */
  playerByNodeId?: Maybe<Player>;
  /** Reads a single `Race` using its globally unique `ID`. */
  raceByNodeId?: Maybe<Race>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGamesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GamesOrderBy>>;
  condition?: Maybe<GameCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPeopleArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PeopleOrderBy>>;
  condition?: Maybe<PersonCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPlanetsArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PlanetsOrderBy>>;
  condition?: Maybe<PlanetCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPlayersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PlayersOrderBy>>;
  condition?: Maybe<PlayerCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryRacesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<RacesOrderBy>>;
  condition?: Maybe<RaceCondition>;
};

/** The root query type which gives access points into the data universe. */
export type QueryGameArgs = {
  id: Scalars["UUID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPersonArgs = {
  id: Scalars["UUID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPlanetArgs = {
  id: Scalars["UUID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPlayerArgs = {
  gameId: Scalars["UUID"];
  personId: Scalars["UUID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryRaceArgs = {
  id: Scalars["UUID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryGameByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPersonByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPlanetByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryPlayerByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** The root query type which gives access points into the data universe. */
export type QueryRaceByNodeIdArgs = {
  nodeId: Scalars["ID"];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
};

/** Methods to use when ordering `Game`. */
export enum GamesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  AuthorIdAsc = "AUTHOR_ID_ASC",
  AuthorIdDesc = "AUTHOR_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
}

/** A condition to be used against `Game` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GameCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["UUID"]>;
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: Maybe<Scalars["UUID"]>;
};

/** A connection to a list of `Game` values. */
export type GamesConnection = {
  __typename?: "GamesConnection";
  /** A list of `Game` objects. */
  nodes: Array<Game>;
  /** A list of edges which contains the `Game` and cursor to aid in pagination. */
  edges: Array<GamesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Game` you could get from the connection. */
  totalCount: Scalars["Int"];
};

export type Game = Node & {
  __typename?: "Game";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  id: Scalars["UUID"];
  name: Scalars["String"];
  authorId?: Maybe<Scalars["UUID"]>;
  playerSlots: Scalars["Int"];
  type: GalaxyType;
  size: GalaxySize;
  started?: Maybe<Scalars["Datetime"]>;
  /** Reads a single `Person` that is related to this `Game`. */
  author?: Maybe<Person>;
  /** Reads and enables pagination through a set of `Player`. */
  players: PlayersConnection;
};

export type GamePlayersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PlayersOrderBy>>;
  condition?: Maybe<PlayerCondition>;
};

export enum GalaxyType {
  Spiral = "SPIRAL",
  Elliptical = "ELLIPTICAL",
}

export enum GalaxySize {
  Tiny = "TINY",
  Normal = "NORMAL",
  Big = "BIG",
  Giant = "GIANT",
}

export type Person = Node & {
  __typename?: "Person";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  id: Scalars["UUID"];
  name: Scalars["String"];
  /** Reads and enables pagination through a set of `Game`. */
  authoredGames: GamesConnection;
  /** Reads and enables pagination through a set of `Player`. */
  players: PlayersConnection;
};

export type PersonAuthoredGamesArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<GamesOrderBy>>;
  condition?: Maybe<GameCondition>;
};

export type PersonPlayersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PlayersOrderBy>>;
  condition?: Maybe<PlayerCondition>;
};

/** Methods to use when ordering `Player`. */
export enum PlayersOrderBy {
  Natural = "NATURAL",
  GameIdAsc = "GAME_ID_ASC",
  GameIdDesc = "GAME_ID_DESC",
  PersonIdAsc = "PERSON_ID_ASC",
  PersonIdDesc = "PERSON_ID_DESC",
  RaceIdAsc = "RACE_ID_ASC",
  RaceIdDesc = "RACE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
}

/** A condition to be used against `Player` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PlayerCondition = {
  /** Checks for equality with the object’s `gameId` field. */
  gameId?: Maybe<Scalars["UUID"]>;
  /** Checks for equality with the object’s `personId` field. */
  personId?: Maybe<Scalars["UUID"]>;
  /** Checks for equality with the object’s `raceId` field. */
  raceId?: Maybe<Scalars["UUID"]>;
};

/** A connection to a list of `Player` values. */
export type PlayersConnection = {
  __typename?: "PlayersConnection";
  /** A list of `Player` objects. */
  nodes: Array<Player>;
  /** A list of edges which contains the `Player` and cursor to aid in pagination. */
  edges: Array<PlayersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Player` you could get from the connection. */
  totalCount: Scalars["Int"];
};

export type Player = Node & {
  __typename?: "Player";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  gameId: Scalars["UUID"];
  personId: Scalars["UUID"];
  raceId: Scalars["UUID"];
  /** Reads a single `Game` that is related to this `Player`. */
  game?: Maybe<Game>;
  /** Reads a single `Person` that is related to this `Player`. */
  person?: Maybe<Person>;
  /** Reads a single `Race` that is related to this `Player`. */
  race?: Maybe<Race>;
};

export type Race = Node & {
  __typename?: "Race";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  id: Scalars["UUID"];
  name: Scalars["String"];
  /** Reads and enables pagination through a set of `Player`. */
  players: PlayersConnection;
};

export type RacePlayersArgs = {
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  after?: Maybe<Scalars["Cursor"]>;
  orderBy?: Maybe<Array<PlayersOrderBy>>;
  condition?: Maybe<PlayerCondition>;
};

/** A `Player` edge in the connection. */
export type PlayersEdge = {
  __typename?: "PlayersEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Player` at the end of the edge. */
  node: Player;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["Cursor"]>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["Cursor"]>;
};

/** A `Game` edge in the connection. */
export type GamesEdge = {
  __typename?: "GamesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Game` at the end of the edge. */
  node: Game;
};

/** Methods to use when ordering `Person`. */
export enum PeopleOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
}

/** A condition to be used against `Person` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PersonCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["UUID"]>;
};

/** A connection to a list of `Person` values. */
export type PeopleConnection = {
  __typename?: "PeopleConnection";
  /** A list of `Person` objects. */
  nodes: Array<Person>;
  /** A list of edges which contains the `Person` and cursor to aid in pagination. */
  edges: Array<PeopleEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Person` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Person` edge in the connection. */
export type PeopleEdge = {
  __typename?: "PeopleEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Person` at the end of the edge. */
  node: Person;
};

/** Methods to use when ordering `Planet`. */
export enum PlanetsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
}

/** A condition to be used against `Planet` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PlanetCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["UUID"]>;
};

/** A connection to a list of `Planet` values. */
export type PlanetsConnection = {
  __typename?: "PlanetsConnection";
  /** A list of `Planet` objects. */
  nodes: Array<Planet>;
  /** A list of edges which contains the `Planet` and cursor to aid in pagination. */
  edges: Array<PlanetsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Planet` you could get from the connection. */
  totalCount: Scalars["Int"];
};

export type Planet = Node & {
  __typename?: "Planet";
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"];
  id: Scalars["UUID"];
  name: Scalars["String"];
  class: PlanetClass;
  position: Vector2;
};

export enum PlanetClass {
  ClassA = "CLASS_A",
  ClassC = "CLASS_C",
  ClassD = "CLASS_D",
  ClassH = "CLASS_H",
  ClassJ = "CLASS_J",
  ClassK = "CLASS_K",
  ClassL = "CLASS_L",
  ClassM = "CLASS_M",
  ClassO = "CLASS_O",
  ClassP = "CLASS_P",
  ClassR = "CLASS_R",
  ClassY = "CLASS_Y",
}

export type Vector2 = {
  __typename?: "Vector2";
  x?: Maybe<Scalars["Float"]>;
  y?: Maybe<Scalars["Float"]>;
};

/** A `Planet` edge in the connection. */
export type PlanetsEdge = {
  __typename?: "PlanetsEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Planet` at the end of the edge. */
  node: Planet;
};

/** Methods to use when ordering `Race`. */
export enum RacesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
}

/** A condition to be used against `Race` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type RaceCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars["UUID"]>;
};

/** A connection to a list of `Race` values. */
export type RacesConnection = {
  __typename?: "RacesConnection";
  /** A list of `Race` objects. */
  nodes: Array<Race>;
  /** A list of edges which contains the `Race` and cursor to aid in pagination. */
  edges: Array<RacesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Race` you could get from the connection. */
  totalCount: Scalars["Int"];
};

/** A `Race` edge in the connection. */
export type RacesEdge = {
  __typename?: "RacesEdge";
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars["Cursor"]>;
  /** The `Race` at the end of the edge. */
  node: Race;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: "Mutation";
  /** Creates a single `Person`. */
  createPerson?: Maybe<CreatePersonPayload>;
  /** Creates a single `Planet`. */
  createPlanet?: Maybe<CreatePlanetPayload>;
  /** Creates a single `Player`. */
  createPlayer?: Maybe<CreatePlayerPayload>;
  /** Creates a single `Race`. */
  createRace?: Maybe<CreateRacePayload>;
  /** Updates a single `Game` using its globally unique id and a patch. */
  updateGameByNodeId?: Maybe<UpdateGamePayload>;
  /** Updates a single `Game` using a unique key and a patch. */
  updateGame?: Maybe<UpdateGamePayload>;
  /** Updates a single `Person` using its globally unique id and a patch. */
  updatePersonByNodeId?: Maybe<UpdatePersonPayload>;
  /** Updates a single `Person` using a unique key and a patch. */
  updatePerson?: Maybe<UpdatePersonPayload>;
  /** Updates a single `Planet` using its globally unique id and a patch. */
  updatePlanetByNodeId?: Maybe<UpdatePlanetPayload>;
  /** Updates a single `Planet` using a unique key and a patch. */
  updatePlanet?: Maybe<UpdatePlanetPayload>;
  /** Updates a single `Player` using its globally unique id and a patch. */
  updatePlayerByNodeId?: Maybe<UpdatePlayerPayload>;
  /** Updates a single `Player` using a unique key and a patch. */
  updatePlayer?: Maybe<UpdatePlayerPayload>;
  /** Updates a single `Race` using its globally unique id and a patch. */
  updateRaceByNodeId?: Maybe<UpdateRacePayload>;
  /** Updates a single `Race` using a unique key and a patch. */
  updateRace?: Maybe<UpdateRacePayload>;
  /** Deletes a single `Game` using its globally unique id. */
  deleteGameByNodeId?: Maybe<DeleteGamePayload>;
  /** Deletes a single `Game` using a unique key. */
  deleteGame?: Maybe<DeleteGamePayload>;
  /** Deletes a single `Person` using its globally unique id. */
  deletePersonByNodeId?: Maybe<DeletePersonPayload>;
  /** Deletes a single `Person` using a unique key. */
  deletePerson?: Maybe<DeletePersonPayload>;
  /** Deletes a single `Planet` using its globally unique id. */
  deletePlanetByNodeId?: Maybe<DeletePlanetPayload>;
  /** Deletes a single `Planet` using a unique key. */
  deletePlanet?: Maybe<DeletePlanetPayload>;
  /** Deletes a single `Player` using its globally unique id. */
  deletePlayerByNodeId?: Maybe<DeletePlayerPayload>;
  /** Deletes a single `Player` using a unique key. */
  deletePlayer?: Maybe<DeletePlayerPayload>;
  /** Deletes a single `Race` using its globally unique id. */
  deleteRaceByNodeId?: Maybe<DeleteRacePayload>;
  /** Deletes a single `Race` using a unique key. */
  deleteRace?: Maybe<DeleteRacePayload>;
  authenticate?: Maybe<AuthenticatePayload>;
  createGame?: Maybe<CreateGamePayload>;
  currentPersonId?: Maybe<CurrentPersonIdPayload>;
  joinGame?: Maybe<JoinGamePayload>;
  register?: Maybe<RegisterPayload>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePlanetArgs = {
  input: CreatePlanetInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePlayerArgs = {
  input: CreatePlayerInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRaceArgs = {
  input: CreateRaceInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameByNodeIdArgs = {
  input: UpdateGameByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameArgs = {
  input: UpdateGameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonByNodeIdArgs = {
  input: UpdatePersonByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonArgs = {
  input: UpdatePersonInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlanetByNodeIdArgs = {
  input: UpdatePlanetByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlanetArgs = {
  input: UpdatePlanetInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlayerByNodeIdArgs = {
  input: UpdatePlayerByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlayerArgs = {
  input: UpdatePlayerInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRaceByNodeIdArgs = {
  input: UpdateRaceByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRaceArgs = {
  input: UpdateRaceInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameByNodeIdArgs = {
  input: DeleteGameByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameArgs = {
  input: DeleteGameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonByNodeIdArgs = {
  input: DeletePersonByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonArgs = {
  input: DeletePersonInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlanetByNodeIdArgs = {
  input: DeletePlanetByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlanetArgs = {
  input: DeletePlanetInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlayerByNodeIdArgs = {
  input: DeletePlayerByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlayerArgs = {
  input: DeletePlayerInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRaceByNodeIdArgs = {
  input: DeleteRaceByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRaceArgs = {
  input: DeleteRaceInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGameArgs = {
  input: CreateGameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCurrentPersonIdArgs = {
  input: CurrentPersonIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationJoinGameArgs = {
  input: JoinGameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationRegisterArgs = {
  input: RegisterInput;
};

/** All input for the create `Person` mutation. */
export type CreatePersonInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Person` to be created by this mutation. */
  person: PersonInput;
};

/** An input for mutations affecting `Person` */
export type PersonInput = {
  id?: Maybe<Scalars["UUID"]>;
  name: Scalars["String"];
};

/** The output of our create `Person` mutation. */
export type CreatePersonPayload = {
  __typename?: "CreatePersonPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Person` that was created by this mutation. */
  person?: Maybe<Person>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PeopleEdge>;
};

/** The output of our create `Person` mutation. */
export type CreatePersonPayloadPersonEdgeArgs = {
  orderBy?: Maybe<Array<PeopleOrderBy>>;
};

/** All input for the create `Planet` mutation. */
export type CreatePlanetInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Planet` to be created by this mutation. */
  planet: PlanetInput;
};

/** An input for mutations affecting `Planet` */
export type PlanetInput = {
  id?: Maybe<Scalars["UUID"]>;
  name: Scalars["String"];
  class: PlanetClass;
  position: Vector2Input;
};

/** An input for mutations affecting `Vector2` */
export type Vector2Input = {
  x?: Maybe<Scalars["Float"]>;
  y?: Maybe<Scalars["Float"]>;
};

/** The output of our create `Planet` mutation. */
export type CreatePlanetPayload = {
  __typename?: "CreatePlanetPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Planet` that was created by this mutation. */
  planet?: Maybe<Planet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Planet`. May be used by Relay 1. */
  planetEdge?: Maybe<PlanetsEdge>;
};

/** The output of our create `Planet` mutation. */
export type CreatePlanetPayloadPlanetEdgeArgs = {
  orderBy?: Maybe<Array<PlanetsOrderBy>>;
};

/** All input for the create `Player` mutation. */
export type CreatePlayerInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Player` to be created by this mutation. */
  player: PlayerInput;
};

/** An input for mutations affecting `Player` */
export type PlayerInput = {
  gameId: Scalars["UUID"];
  personId: Scalars["UUID"];
  raceId: Scalars["UUID"];
};

/** The output of our create `Player` mutation. */
export type CreatePlayerPayload = {
  __typename?: "CreatePlayerPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Player` that was created by this mutation. */
  player?: Maybe<Player>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Game` that is related to this `Player`. */
  game?: Maybe<Game>;
  /** Reads a single `Person` that is related to this `Player`. */
  person?: Maybe<Person>;
  /** Reads a single `Race` that is related to this `Player`. */
  race?: Maybe<Race>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
};

/** The output of our create `Player` mutation. */
export type CreatePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Maybe<Array<PlayersOrderBy>>;
};

/** All input for the create `Race` mutation. */
export type CreateRaceInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Race` to be created by this mutation. */
  race: RaceInput;
};

/** An input for mutations affecting `Race` */
export type RaceInput = {
  id?: Maybe<Scalars["UUID"]>;
  name: Scalars["String"];
};

/** The output of our create `Race` mutation. */
export type CreateRacePayload = {
  __typename?: "CreateRacePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Race` that was created by this mutation. */
  race?: Maybe<Race>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Race`. May be used by Relay 1. */
  raceEdge?: Maybe<RacesEdge>;
};

/** The output of our create `Race` mutation. */
export type CreateRacePayloadRaceEdgeArgs = {
  orderBy?: Maybe<Array<RacesOrderBy>>;
};

/** All input for the `updateGameByNodeId` mutation. */
export type UpdateGameByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Game` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Game` being updated. */
  patch: GamePatch;
};

/** Represents an update to a `Game`. Fields that are set will be updated. */
export type GamePatch = {
  id?: Maybe<Scalars["UUID"]>;
  name?: Maybe<Scalars["String"]>;
  authorId?: Maybe<Scalars["UUID"]>;
  playerSlots?: Maybe<Scalars["Int"]>;
  type?: Maybe<GalaxyType>;
  size?: Maybe<GalaxySize>;
  started?: Maybe<Scalars["Datetime"]>;
};

/** The output of our update `Game` mutation. */
export type UpdateGamePayload = {
  __typename?: "UpdateGamePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Game` that was updated by this mutation. */
  game?: Maybe<Game>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Person` that is related to this `Game`. */
  author?: Maybe<Person>;
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>;
};

/** The output of our update `Game` mutation. */
export type UpdateGamePayloadGameEdgeArgs = {
  orderBy?: Maybe<Array<GamesOrderBy>>;
};

/** All input for the `updateGame` mutation. */
export type UpdateGameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Game` being updated. */
  patch: GamePatch;
  id: Scalars["UUID"];
};

/** All input for the `updatePersonByNodeId` mutation. */
export type UpdatePersonByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Person` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Person` being updated. */
  patch: PersonPatch;
};

/** Represents an update to a `Person`. Fields that are set will be updated. */
export type PersonPatch = {
  id?: Maybe<Scalars["UUID"]>;
  name?: Maybe<Scalars["String"]>;
};

/** The output of our update `Person` mutation. */
export type UpdatePersonPayload = {
  __typename?: "UpdatePersonPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Person` that was updated by this mutation. */
  person?: Maybe<Person>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PeopleEdge>;
};

/** The output of our update `Person` mutation. */
export type UpdatePersonPayloadPersonEdgeArgs = {
  orderBy?: Maybe<Array<PeopleOrderBy>>;
};

/** All input for the `updatePerson` mutation. */
export type UpdatePersonInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Person` being updated. */
  patch: PersonPatch;
  id: Scalars["UUID"];
};

/** All input for the `updatePlanetByNodeId` mutation. */
export type UpdatePlanetByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Planet` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Planet` being updated. */
  patch: PlanetPatch;
};

/** Represents an update to a `Planet`. Fields that are set will be updated. */
export type PlanetPatch = {
  id?: Maybe<Scalars["UUID"]>;
  name?: Maybe<Scalars["String"]>;
  class?: Maybe<PlanetClass>;
  position?: Maybe<Vector2Input>;
};

/** The output of our update `Planet` mutation. */
export type UpdatePlanetPayload = {
  __typename?: "UpdatePlanetPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Planet` that was updated by this mutation. */
  planet?: Maybe<Planet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Planet`. May be used by Relay 1. */
  planetEdge?: Maybe<PlanetsEdge>;
};

/** The output of our update `Planet` mutation. */
export type UpdatePlanetPayloadPlanetEdgeArgs = {
  orderBy?: Maybe<Array<PlanetsOrderBy>>;
};

/** All input for the `updatePlanet` mutation. */
export type UpdatePlanetInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Planet` being updated. */
  patch: PlanetPatch;
  id: Scalars["UUID"];
};

/** All input for the `updatePlayerByNodeId` mutation. */
export type UpdatePlayerByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Player` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Player` being updated. */
  patch: PlayerPatch;
};

/** Represents an update to a `Player`. Fields that are set will be updated. */
export type PlayerPatch = {
  gameId?: Maybe<Scalars["UUID"]>;
  personId?: Maybe<Scalars["UUID"]>;
  raceId?: Maybe<Scalars["UUID"]>;
};

/** The output of our update `Player` mutation. */
export type UpdatePlayerPayload = {
  __typename?: "UpdatePlayerPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Player` that was updated by this mutation. */
  player?: Maybe<Player>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Game` that is related to this `Player`. */
  game?: Maybe<Game>;
  /** Reads a single `Person` that is related to this `Player`. */
  person?: Maybe<Person>;
  /** Reads a single `Race` that is related to this `Player`. */
  race?: Maybe<Race>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
};

/** The output of our update `Player` mutation. */
export type UpdatePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Maybe<Array<PlayersOrderBy>>;
};

/** All input for the `updatePlayer` mutation. */
export type UpdatePlayerInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Player` being updated. */
  patch: PlayerPatch;
  gameId: Scalars["UUID"];
  personId: Scalars["UUID"];
};

/** All input for the `updateRaceByNodeId` mutation. */
export type UpdateRaceByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Race` to be updated. */
  nodeId: Scalars["ID"];
  /** An object where the defined keys will be set on the `Race` being updated. */
  patch: RacePatch;
};

/** Represents an update to a `Race`. Fields that are set will be updated. */
export type RacePatch = {
  id?: Maybe<Scalars["UUID"]>;
  name?: Maybe<Scalars["String"]>;
};

/** The output of our update `Race` mutation. */
export type UpdateRacePayload = {
  __typename?: "UpdateRacePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Race` that was updated by this mutation. */
  race?: Maybe<Race>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Race`. May be used by Relay 1. */
  raceEdge?: Maybe<RacesEdge>;
};

/** The output of our update `Race` mutation. */
export type UpdateRacePayloadRaceEdgeArgs = {
  orderBy?: Maybe<Array<RacesOrderBy>>;
};

/** All input for the `updateRace` mutation. */
export type UpdateRaceInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** An object where the defined keys will be set on the `Race` being updated. */
  patch: RacePatch;
  id: Scalars["UUID"];
};

/** All input for the `deleteGameByNodeId` mutation. */
export type DeleteGameByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Game` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The output of our delete `Game` mutation. */
export type DeleteGamePayload = {
  __typename?: "DeleteGamePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Game` that was deleted by this mutation. */
  game?: Maybe<Game>;
  deletedGameNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Person` that is related to this `Game`. */
  author?: Maybe<Person>;
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>;
};

/** The output of our delete `Game` mutation. */
export type DeleteGamePayloadGameEdgeArgs = {
  orderBy?: Maybe<Array<GamesOrderBy>>;
};

/** All input for the `deleteGame` mutation. */
export type DeleteGameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  id: Scalars["UUID"];
};

/** All input for the `deletePersonByNodeId` mutation. */
export type DeletePersonByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Person` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The output of our delete `Person` mutation. */
export type DeletePersonPayload = {
  __typename?: "DeletePersonPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Person` that was deleted by this mutation. */
  person?: Maybe<Person>;
  deletedPersonNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PeopleEdge>;
};

/** The output of our delete `Person` mutation. */
export type DeletePersonPayloadPersonEdgeArgs = {
  orderBy?: Maybe<Array<PeopleOrderBy>>;
};

/** All input for the `deletePerson` mutation. */
export type DeletePersonInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  id: Scalars["UUID"];
};

/** All input for the `deletePlanetByNodeId` mutation. */
export type DeletePlanetByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Planet` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The output of our delete `Planet` mutation. */
export type DeletePlanetPayload = {
  __typename?: "DeletePlanetPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Planet` that was deleted by this mutation. */
  planet?: Maybe<Planet>;
  deletedPlanetNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Planet`. May be used by Relay 1. */
  planetEdge?: Maybe<PlanetsEdge>;
};

/** The output of our delete `Planet` mutation. */
export type DeletePlanetPayloadPlanetEdgeArgs = {
  orderBy?: Maybe<Array<PlanetsOrderBy>>;
};

/** All input for the `deletePlanet` mutation. */
export type DeletePlanetInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  id: Scalars["UUID"];
};

/** All input for the `deletePlayerByNodeId` mutation. */
export type DeletePlayerByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Player` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The output of our delete `Player` mutation. */
export type DeletePlayerPayload = {
  __typename?: "DeletePlayerPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Player` that was deleted by this mutation. */
  player?: Maybe<Player>;
  deletedPlayerNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Game` that is related to this `Player`. */
  game?: Maybe<Game>;
  /** Reads a single `Person` that is related to this `Player`. */
  person?: Maybe<Person>;
  /** Reads a single `Race` that is related to this `Player`. */
  race?: Maybe<Race>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
};

/** The output of our delete `Player` mutation. */
export type DeletePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Maybe<Array<PlayersOrderBy>>;
};

/** All input for the `deletePlayer` mutation. */
export type DeletePlayerInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  gameId: Scalars["UUID"];
  personId: Scalars["UUID"];
};

/** All input for the `deleteRaceByNodeId` mutation. */
export type DeleteRaceByNodeIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The globally unique `ID` which will identify a single `Race` to be deleted. */
  nodeId: Scalars["ID"];
};

/** The output of our delete `Race` mutation. */
export type DeleteRacePayload = {
  __typename?: "DeleteRacePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  /** The `Race` that was deleted by this mutation. */
  race?: Maybe<Race>;
  deletedRaceNodeId?: Maybe<Scalars["ID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Race`. May be used by Relay 1. */
  raceEdge?: Maybe<RacesEdge>;
};

/** The output of our delete `Race` mutation. */
export type DeleteRacePayloadRaceEdgeArgs = {
  orderBy?: Maybe<Array<RacesOrderBy>>;
};

/** All input for the `deleteRace` mutation. */
export type DeleteRaceInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  id: Scalars["UUID"];
};

/** All input for the `authenticate` mutation. */
export type AuthenticateInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  password: Scalars["String"];
};

/** The output of our `authenticate` mutation. */
export type AuthenticatePayload = {
  __typename?: "AuthenticatePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  jwt?: Maybe<Scalars["Jwt"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `createGame` mutation. */
export type CreateGameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
};

/** The output of our `createGame` mutation. */
export type CreateGamePayload = {
  __typename?: "CreateGamePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  game?: Maybe<Game>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Person` that is related to this `Game`. */
  author?: Maybe<Person>;
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>;
};

/** The output of our `createGame` mutation. */
export type CreateGamePayloadGameEdgeArgs = {
  orderBy?: Maybe<Array<GamesOrderBy>>;
};

/** All input for the `currentPersonId` mutation. */
export type CurrentPersonIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
};

/** The output of our `currentPersonId` mutation. */
export type CurrentPersonIdPayload = {
  __typename?: "CurrentPersonIdPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  uuid?: Maybe<Scalars["UUID"]>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `joinGame` mutation. */
export type JoinGameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  gameId: Scalars["UUID"];
  raceId: Scalars["UUID"];
};

/** The output of our `joinGame` mutation. */
export type JoinGamePayload = {
  __typename?: "JoinGamePayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  player?: Maybe<Player>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Game` that is related to this `Player`. */
  game?: Maybe<Game>;
  /** Reads a single `Person` that is related to this `Player`. */
  person?: Maybe<Person>;
  /** Reads a single `Race` that is related to this `Player`. */
  race?: Maybe<Race>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
};

/** The output of our `joinGame` mutation. */
export type JoinGamePayloadPlayerEdgeArgs = {
  orderBy?: Maybe<Array<PlayersOrderBy>>;
};

/** All input for the `register` mutation. */
export type RegisterInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

/** The output of our `register` mutation. */
export type RegisterPayload = {
  __typename?: "RegisterPayload";
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars["String"]>;
  person?: Maybe<Person>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PeopleEdge>;
};

/** The output of our `register` mutation. */
export type RegisterPayloadPersonEdgeArgs = {
  orderBy?: Maybe<Array<PeopleOrderBy>>;
};

export type SignInMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type SignInMutation = { __typename?: "Mutation" } & {
  authenticate?: Maybe<
    { __typename?: "AuthenticatePayload" } & Pick<AuthenticatePayload, "jwt">
  >;
};

export type SignUpMutationVariables = Exact<{
  name: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type SignUpMutation = { __typename?: "Mutation" } & {
  register?: Maybe<
    { __typename?: "RegisterPayload" } & Pick<
      RegisterPayload,
      "clientMutationId"
    >
  >;
  authenticate?: Maybe<
    { __typename?: "AuthenticatePayload" } & Pick<AuthenticatePayload, "jwt">
  >;
};

export type GameDetailsQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GameDetailsQuery = { __typename?: "Query" } & {
  game?: Maybe<
    { __typename?: "Game" } & Pick<
      Game,
      "id" | "name" | "type" | "size" | "started" | "playerSlots"
    > & {
        players: { __typename?: "PlayersConnection" } & Pick<
          PlayersConnection,
          "totalCount"
        >;
        author?: Maybe<{ __typename?: "Person" } & Pick<Person, "id" | "name">>;
      }
  >;
};

export type GamePlayerListQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GamePlayerListQuery = { __typename?: "Query" } & {
  players?: Maybe<
    { __typename?: "PlayersConnection" } & {
      nodes: Array<
        { __typename?: "Player" } & {
          person?: Maybe<
            { __typename?: "Person" } & Pick<Person, "id" | "name">
          >;
          race?: Maybe<{ __typename?: "Race" } & Pick<Race, "id" | "name">>;
        }
      >;
    }
  >;
};

export type RacesQueryVariables = Exact<{ [key: string]: never }>;

export type RacesQuery = { __typename?: "Query" } & {
  races?: Maybe<
    { __typename?: "RacesConnection" } & {
      nodes: Array<{ __typename?: "Race" } & Pick<Race, "id" | "name">>;
    }
  >;
};

export type GameListQueryVariables = Exact<{
  cursor?: Maybe<Scalars["Cursor"]>;
}>;

export type GameListQuery = { __typename?: "Query" } & {
  games?: Maybe<
    { __typename?: "GamesConnection" } & Pick<GamesConnection, "totalCount"> & {
        edges: Array<
          { __typename?: "GamesEdge" } & Pick<GamesEdge, "cursor"> & {
              node: { __typename?: "Game" } & Pick<
                Game,
                "id" | "name" | "playerSlots"
              > & {
                  author?: Maybe<
                    { __typename?: "Person" } & Pick<Person, "id" | "name">
                  >;
                  players: { __typename?: "PlayersConnection" } & Pick<
                    PlayersConnection,
                    "totalCount"
                  >;
                };
            }
        >;
      }
  >;
};

export type CreateGameMutationVariables = Exact<{
  name: Scalars["String"];
}>;

export type CreateGameMutation = { __typename?: "Mutation" } & {
  createGame?: Maybe<
    { __typename?: "CreateGamePayload" } & {
      game?: Maybe<
        { __typename?: "Game" } & Pick<
          Game,
          "id" | "name" | "type" | "size" | "started" | "playerSlots"
        > & {
            players: { __typename?: "PlayersConnection" } & Pick<
              PlayersConnection,
              "totalCount"
            >;
            author?: Maybe<
              { __typename?: "Person" } & Pick<Person, "id" | "name">
            >;
          }
      >;
    }
  >;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = { __typename?: "Query" } & {
  currentPerson?: Maybe<
    { __typename?: "Person" } & Pick<Person, "id" | "name">
  >;
};
