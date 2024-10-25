import type { DocumentNode } from 'graphql';
  export const typeDefs = {"kind":"Document","definitions":[{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"Vector"},"directives":[]},{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"BigInt"},"directives":[]},{"kind":"InterfaceTypeDefinition","name":{"kind":"Name","value":"Positionable"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"position"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}},"directives":[]}]},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"TrackGalaxyEvent"},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"PositionableApppearsEvent"}},{"kind":"NamedType","name":{"kind":"Name","value":"PositionableMovesEvent"}},{"kind":"NamedType","name":{"kind":"Name","value":"PositionableDisappearsEvent"}}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PositionableApppearsEvent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Positionable"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PositionableMovesEvent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Positionable"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PositionableDisappearsEvent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Positionable"}}},"directives":[]}]},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"TrackStarSystemEvent"},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipCommisionProgressEvent"}}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceShipCommisionProgressEvent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipCommision"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Subscription"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"trackGalaxy"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"gameId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrackGalaxyEvent"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"trackStarSystem"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"starSystemId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrackStarSystemEvent"}}},"directives":[]}]},{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"DateTime"},"directives":[]},{"name":{"kind":"Name","value":"Game"},"kind":"ObjectTypeDefinition","fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"startedAt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"players"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tickRate"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"me"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shipDesigns"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"starSystems"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taskForces"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}}}}},"directives":[]}],"directives":[],"interfaces":[]},{"name":{"kind":"Name","value":"Player"},"kind":"ObjectTypeDefinition","fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"color"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shipDesigns"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}}}}},"directives":[]}],"directives":[],"interfaces":[]},{"name":{"kind":"Name","value":"Query"},"kind":"ObjectTypeDefinition","fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"games"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"starSystem"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StarSystem"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taskForceShipCommision"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipCommision"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"me"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]}],"directives":[],"interfaces":[]},{"name":{"kind":"Name","value":"Mutation"},"kind":"ObjectTypeDefinition","fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createShipDesign"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"gameId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"design"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesignInput"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createTaskForceCommision"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"commision"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceCommisionInput"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"orderTaskForce"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"orders"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceOrderInput"}}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"queue"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"registerWithPassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"loginWithRefreshToken"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}],"directives":[],"interfaces":[]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Resource"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ResourceNeed"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"resource"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alotted"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"needed"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ShipDesign"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"owner"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hullRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"speedRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"armorRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shieldRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"weaponRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zoneOfControlRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sensorRating"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"supplyNeed"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"supplyCapacity"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"decommissioned"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"previousDesign"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"costs"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceCost"}}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ResourceCost"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"resource"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"quantity"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ShipDesignInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"description"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"hullRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"speedRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"armorRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"shieldRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"weaponRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zoneOfControlRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sensorRating"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"supplyCapacity"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"previousDesignId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"name":{"kind":"Name","value":"StarSystem"},"kind":"ObjectTypeDefinition","fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"position"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"owner"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sensorRange"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"discoveries"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Discovery"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"resourceDepots"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDepot"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"populations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Population"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isVisible"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastUpdate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taskForceShipCommisions"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipCommision"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taskForces"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForce"}}}}},"directives":[]}],"directives":[],"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Positionable"}}]},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"Discovery"},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"ResourceDiscovery"}},{"kind":"NamedType","name":{"kind":"Name","value":"UnknownDiscovery"}}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ResourceDiscovery"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"resource"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"remainingDeposits"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"miningRate"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UnknownDiscovery"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ResourceDepot"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"resource"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"quantity"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Population"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"amount"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"TaskForceShipRole"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"capital"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"screen"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"support"},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TaskForce"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Positionable"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"position"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"orders"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceOrder"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"movementVector"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"owner"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"game"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sensorRange"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ships"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShip"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"commisions"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipCommision"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isVisible"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastUpdate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceShip"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"role"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipRole"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shipDesign"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hullState"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shieldState"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"armorState"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"weaponState"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"supplyCarried"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceShipCommision"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"role"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipRole"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shipDesign"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipDesign"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"resourceNeeds"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceNeed"}}}}},"directives":[]}]},{"kind":"InterfaceTypeDefinition","name":{"kind":"Name","value":"TaskForceOrder"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceMoveOrder"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceOrder"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"destination"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceCommisionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"starSystemId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ships"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceCommisionShipInput"}}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceCommisionShipInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"role"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceShipRole"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"shipDesignId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceOrderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"move"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskForceMoveOrderInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"TaskForceMoveOrderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"destination"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Vector"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"SchemaDefinition","operationTypes":[{"kind":"OperationTypeDefinition","type":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"operation":"query"},{"kind":"OperationTypeDefinition","type":{"kind":"NamedType","name":{"kind":"Name","value":"Mutation"}},"operation":"mutation"},{"kind":"OperationTypeDefinition","type":{"kind":"NamedType","name":{"kind":"Name","value":"Subscription"}},"operation":"subscription"}]}]} as unknown as DocumentNode