-- Active: 1727998475340@@127.0.0.1@5432@postgres
-- Custom SQL migration file, put you code below! --

DROP VIEW IF EXISTS "visibility";

CREATE VIEW "visibility" AS (
    SELECT
        tf."id" as "id",
        tf."ownerId" as "userId",
        tf."gameId" as "gameId",
        circle(tf.position, 100) as "circle"
    FROM "taskForces" tf
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
