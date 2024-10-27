DROP VIEW "public"."visibility";
--> statement-breakpoint
DROP VIEW "public"."taskForceShipsWithStats";
--> statement-breakpoint
DROP VIEW "public"."shipDesignsWithStats";
--> statement-breakpoint
CREATE VIEW "public"."shipDesignsWithStats" AS (
    select
        "shipDesigns"."id",
        "shipDesigns"."name",
        "shipDesigns"."description",
        "shipDesigns"."decommissioned",
        "shipDesigns"."previousDesignId",
        jsonb_agg(
            jsonb_build_object(
                'resourceId',
                "shipDesignResourceCosts"."resourceId",
                'quantity',
                "shipDesignResourceCosts"."quantity"
            )
        ) as "resourceCosts",
        jsonb_agg(
            "shipComponents"
        ) as "components",
        sum("shipComponents"."supplyNeed") as "supplyNeed",
        sum("shipComponents"."powerNeed") as "powerNeed",
        sum("shipComponents"."crewNeed") as "crewNeed",
        sum(
            "shipComponents"."constructionCost"
        ) as "constructionCost",
        sum(
            "shipComponents"."supplyCapacity"
        ) as "supplyCapacity",
        sum(
            "shipComponents"."powerGeneration"
        ) as "powerGeneration",
        sum(
            "shipComponents"."crewCapacity"
        ) as "crewCapacity",
        min("shipComponents"."ftlSpeed") as "ftlSpeed",
        max(
            "shipComponents"."zoneOfControl"
        ) as "zoneOfControl",
        max(
            "shipComponents"."sensorRange"
        ) as "sensorRange"
    from
        "shipDesigns"
        inner join "shipDesignResourceCosts" on "shipDesigns"."id" = "shipDesignResourceCosts"."shipDesignId"
        inner join "shipDesignComponents" on "shipDesigns"."id" = "shipDesignComponents"."shipDesignId"
        inner join "shipComponents" on "shipComponents"."id" = "shipDesignComponents"."shipComponentId"
    group by
        "shipDesigns"."id"
);

CREATE VIEW "public"."taskForceShipsWithStats" AS (
    select
        "taskForceShips"."id",
        "taskForceShips"."taskForceId",
        "taskForceShips"."name",
        "taskForceShips"."role",
        "supplyNeed",
        "powerNeed",
        "crewNeed",
        "supplyCapacity",
        "powerGeneration",
        "crewCapacity",
        "ftlSpeed",
        "zoneOfControl",
        "sensorRange"
    from
        "taskForceShips"
        inner join "shipDesignsWithStats" on "taskForceShips"."shipDesignId" = "shipDesignsWithStats"."id"
);
--> statement-breakpoint
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