DROP VIEW "public"."visibility";--> statement-breakpoint
DROP VIEW "public"."taskForceShipsWithStats";--> statement-breakpoint
ALTER TABLE "taskForceShips" ADD COLUMN "structuralIntegrity" numeric(30, 6) DEFAULT '0' NOT NULL;--> statement-breakpoint
CREATE VIEW "public"."taskForceShipsWithStats" AS (select "taskForceShips"."id", "taskForceShips"."taskForceId", "taskForceShips"."name", "taskForceShips"."role", "taskForceShips"."supplyCarried", "taskForceShips"."structuralIntegrity", "taskForceShips"."componentStates", "supplyNeedPassive", "supplyNeedMovement", "supplyNeedCombat", "powerNeed", "crewNeed", "supplyCapacity", "powerGeneration", "crewCapacity", "ftlSpeed", "zoneOfControl", "sensorRange" from "taskForceShips" inner join "shipDesignsWithStats" on "taskForceShips"."shipDesignId" = "shipDesignsWithStats"."id");
CREATE VIEW "public"."visibility" AS (
    (
        select "taskForces"."ownerId", "taskForces"."gameId", circle(
                "taskForces"."position", max("sensorRange")
            ) as "circle"
        from
            "taskForces"
            inner join "taskForceShipsWithStats" on "taskForces"."id" = "taskForceShipsWithStats"."taskForceId"
        group by
            "taskForces"."id",
            "taskForces"."ownerId",
            "taskForces"."gameId"
    )
    union all
    (
        select
            "ownerId" as "userId",
            "gameId",
            circle("position", 1000) as "circle"
        from "starSystems"
        where
            "starSystems"."ownerId" is not null
    )
);