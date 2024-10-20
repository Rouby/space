-- Custom SQL migration file, put you code below! --

DROP VIEW IF EXISTS "taskForceShipsWithStats";

CREATE VIEW "taskForceShipsWithStats" AS (
    SELECT
        tfs."id" as "id",
        tfs."taskForceId" as "taskForceId",
        tfs."name" as "name",
        tfs."role" as "role",
        tfs."hullState" as "hullState",
        sd."hullRating" as "hullRating",
        (
            sd."hullRating" * tfs."hullState"
        ) as "hull",
        tfs."speedState" as "speedState",
        sd."speedRating" as "speedRating",
        (
            sd."speedRating" * tfs."speedState"
        ) as "speed",
        tfs."shieldState" as "shieldState",
        sd."shieldRating" as "shieldRating",
        (
            sd."shieldRating" * tfs."shieldState"
        ) as "shield",
        tfs."armorState" as "armorState",
        sd."armorRating" as "armorRating",
        (
            sd."armorRating" * tfs."armorState"
        ) as "armor",
        tfs."weaponState" as "weaponState",
        sd."weaponRating" as "weaponRating",
        (
            sd."weaponRating" * tfs."weaponState"
        ) as "weapon",
        tfs."supplyCarried" as "supplyCarried",
        sd."supplyCapacity" as "supplyCapacity",
        (sd."supplyNeed" * 0.01) as "movementSupplyNeed",
        (sd."supplyNeed" * 0.05) as "combatSupplyNeed",
        sd."zoneOfControlRating" as "zoneOfControlRating",
        tfs."sensorState" as "sensorState",
        sd."sensorRating" as "sensorRating",
        (
            sd."sensorRating" * tfs."sensorState" * 100
        ) as "sensor"
    FROM
        "taskForceShips" tfs
        JOIN "shipDesigns" sd ON tfs."shipDesignId" = sd."id"
);

DROP VIEW IF EXISTS "visibility";

CREATE VIEW "visibility" AS (
    SELECT
        tf."id" as "id",
        tf."ownerId" as "userId",
        tf."gameId" as "gameId",
        circle(
            tf.position,
            max(tfs."sensor")
        ) as "circle"
    FROM
        "taskForces" tf
        JOIN "taskForceShipsWithStats" tfs ON tf."id" = tfs."taskForceId"
    WHERE
        tf."ownerId" IS NOT NULL
    GROUP BY
        tf."id",
        tf."ownerId",
        tf."gameId"
)
UNION ALL
(
    SELECT
        ss."id" as "id",
        ss."ownerId" as "userId",
        ss."gameId" as "gameId",
        circle(ss.position, 1000) as "circle"
    FROM "starSystems" ss
    WHERE
        "ownerId" IS NOT NULL
);
