DROP VIEW "public"."visibility";--> statement-breakpoint
DROP INDEX "lastKnownStates_userId_gameId_subjectId_index";--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "lastKnownStates_userId_gameId_subjectId_index" ON "lastKnownStates" USING btree ("userId","gameId","subjectId");--> statement-breakpoint
CREATE VIEW "public"."visibility" AS ((select "ownerId" as "userId", "gameId", circle("position", 250) as "circle" from "taskForces" where "taskForces"."deletedAt" is null group by "taskForces"."id", "taskForces"."ownerId", "taskForces"."gameId") union all (select "ownerId" as "userId", "gameId", circle("position", 1000) as "circle" from "starSystems" where "starSystems"."ownerId" is not null));