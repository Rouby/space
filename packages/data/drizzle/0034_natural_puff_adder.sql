ALTER TABLE "shipDesigns" RENAME COLUMN "previousVersionId" TO "previousDesignId";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP CONSTRAINT "shipDesigns_previousVersionId_shipDesigns_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_previousDesignId_shipDesigns_id_fk" FOREIGN KEY ("previousDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DROP VIEW IF EXISTS "public"."visibility";
DROP VIEW IF EXISTS "public"."taskForceShipsWithStats";
--> statement-breakpoint
CREATE VIEW "public"."taskForceShipsWithStats" AS (select "taskForceShips"."taskForceId", "taskForceShips"."name", "taskForceShips"."role", "taskForceShips"."hullState", "shipDesigns"."hullRating", "shipDesigns"."hullRating" * "taskForceShips"."hullState" as "hull", "taskForceShips"."shieldState", "shipDesigns"."shieldRating", "shipDesigns"."shieldRating" * "taskForceShips"."shieldState" as "shield", "taskForceShips"."armorState", "shipDesigns"."armorRating", "shipDesigns"."armorRating" * "taskForceShips"."armorState" as "armor", "taskForceShips"."weaponState", "shipDesigns"."weaponRating", "shipDesigns"."weaponRating" * "taskForceShips"."weaponState" as "weapon", "taskForceShips"."supplyCarried", "shipDesigns"."supplyCapacity", "shipDesigns"."zoneOfControlRating", "taskForceShips"."sensorState", "shipDesigns"."sensorRating", "shipDesigns"."sensorRating" * "taskForceShips"."sensorState" * 100 as "sensor" from "taskForceShips" inner join "shipDesigns" on "taskForceShips"."shipDesignId" = "shipDesigns"."id");--> statement-breakpoint
CREATE VIEW "public"."visibility" AS ((select "taskForces"."ownerId", "taskForces"."gameId", circle("taskForces"."position", max("sensor")) as "circle" from "taskForces" inner join "taskForceShipsWithStats" on "taskForces"."id" = "taskForceShipsWithStats"."taskForceId" group by "taskForces"."id", "taskForces"."ownerId", "taskForces"."gameId") union all (select "ownerId" as "userId", "gameId", circle("position", 1000) as "circle" from "starSystems" where "starSystems"."ownerId" is not null));