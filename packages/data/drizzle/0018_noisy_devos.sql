DROP VIEW "public"."visibility";--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "ftlSpeed" numeric(30, 6);--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "sensorRange" numeric(30, 6);--> statement-breakpoint
CREATE VIEW "public"."visibility" AS ((select "ownerId" as "userId", "gameId", circle("position", COALESCE("sensorRange", 0)) as "circle" from "taskForces" where "taskForces"."deletedAt" is null group by "taskForces"."id", "taskForces"."ownerId", "taskForces"."gameId") union all (select "ownerId" as "userId", "gameId", circle("position", 1000) as "circle" from "starSystems" where "starSystems"."ownerId" is not null));--> statement-breakpoint
UPDATE "taskForces" SET
  "sensorRange" = COALESCE((
    SELECT max("shipComponents"."sensorRange")
    FROM "taskForceShipDesigns"
    JOIN "shipDesignComponents" ON "shipDesignComponents"."shipDesignId" = "taskForceShipDesigns"."shipDesignId"
    JOIN "shipComponents" ON "shipComponents"."id" = "shipDesignComponents"."shipComponentId"
    WHERE "taskForceShipDesigns"."taskForceId" = "taskForces"."id"
  ), 0),
  "ftlSpeed" = (
    SELECT min("shipComponents"."ftlSpeed")
    FROM "taskForceShipDesigns"
    JOIN "shipDesignComponents" ON "shipDesignComponents"."shipDesignId" = "taskForceShipDesigns"."shipDesignId"
    JOIN "shipComponents" ON "shipComponents"."id" = "shipDesignComponents"."shipComponentId"
    WHERE "taskForceShipDesigns"."taskForceId" = "taskForces"."id"
  );